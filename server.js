require("dotenv").config(); // Import dotenv for environment variables

const express = require("express");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your_secret_key", // Use environment variable for secret
    resave: false,
    saveUninitialized: true,
  })
);

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/bookingDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Successfully connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Define booking schema
const bookingSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  date: String,
  time: String,
  status: { type: String, default: "pending" },
});

const Booking = mongoose.model("Booking", bookingSchema);

// Nodemailer setup (for email notifications)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Use environment variables for credentials
    pass: process.env.EMAIL_PASS,
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
      res.status(500).send("Error saving booking");
    } else {
      res.status(200).send("Booking saved successfully!");

      // Send notification to your email
      const mailOptions = {
        from: process.env.EMAIL_USER,
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
      res.status(200).json(bookings);
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
        res.status(200).send("Appointment updated successfully");
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
      res.status(200).send("Appointment deleted successfully");
    }
  });
});

// Start the server
const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
