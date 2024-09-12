// mongodb.js
const { MongoClient, ServerApiVersion } = require("mongodb");

const uri =
  "mongodb+srv://gmiranda540:Arh9b6tt40rK7bec@gillydakid.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function connectToMongoDB() {
  try {
    // Connect the client to the server
    await client.connect();
    console.log("Successfully connected to MongoDB");
    return client.db("gillydakid"); // Change this to the name of your database
  } catch (err) {
    console.error("Error connecting to MongoDB", err);
  }
}

module.exports = connectToMongoDB;
