const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");

const connectToMongoDB = require("mongodb://localhost:27017/bookingDB"); // Import MongoDB connection

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: true,
  })
);

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/bookingDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define booking schema
const bookingSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  date: String,
  time: String,
  status: { type: String, default: "pending" }, // Add status for appointment approval
});

const Booking = mongoose.model("Booking", bookingSchema);

// Nodemailer setup (for email notifications)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "your_email@gmail.com",
    pass: "your_password",
  },
});

// Route to handle appointment bookings
app.post("/book-appointment", async (req, res) => {
  const newBooking = new Booking({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    date: req.body.date,
    time: req.body.time,
  });

  newBooking.save((err) => {
    if (err) {
      res.send("Error saving booking");
    } else {
      res.send("Booking saved successfully!");

      // Send notification to your email
      const mailOptions = {
        from: "your_email@gmail.com",
        to: "gmiranda540@yahoo.com",
        subject: "New Appointment Booking",
        text: `New appointment booked by ${req.body.name} on ${req.body.date} at ${req.body.time}. Contact: ${req.body.phone}`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
    }
  });
});

// Admin Route: Get all appointments
app.get("/admin/appointments", (req, res) => {
  Booking.find({}, (err, bookings) => {
    if (err) {
      res.status(500).send("Error retrieving bookings");
    } else {
      res.json(bookings);
    }
  });
});

// Admin Route: Update appointment status
app.put("/admin/appointments/:id", (req, res) => {
  Booking.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    (err) => {
      if (err) {
        res.status(500).send("Error updating appointment");
      } else {
        res.send("Appointment updated successfully");
      }
    }
  );
});

// Admin Route: Delete appointment
app.delete("/admin/appointments/:id", (req, res) => {
  Booking.findByIdAndRemove(req.params.id, (err) => {
    if (err) {
      res.status(500).send("Error deleting appointment");
    } else {
      res.send("Appointment deleted successfully");
    }
  });
});

// Start the server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
