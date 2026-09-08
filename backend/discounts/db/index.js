// ℹ️ package responsible to make the connection with mongodb
// https://www.npmjs.com/package/mongoose
const mongoose = require("mongoose");
const client = require("prom-client");

// Create a gauge metric to track MongoDB connection status:
// 1 means connected, 0 means disconnected.
const mongoConnectionGauge = new client.Gauge({
  name: 'mongo_connection_status',
  help: 'Indicates MongoDB connection status: 1 for connected, 0 for disconnected'
});

// ℹ️ Sets the MongoDB URI for our app to have access to it.
// If no env has been set, we dynamically set it to whatever the folder name was upon the creation of the app

const MONGO_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/Restauranty";

mongoose
  .connect(MONGO_URI)
  .then((x) => {
    const dbName = x.connections[0].name;
    console.log(`Connected to Mongo! Database name: "${dbName}"`);
    mongoConnectionGauge.set(1);  // Set gauge to 1 for connected
  })
  .catch((err) => {
    console.error("Error connecting to mongo: ", err);
    mongoConnectionGauge.set(0);  // Set gauge to 0 if connection fails
  });

// Also listen to connection events to update the metric dynamically.
mongoose.connection.on('disconnected', () => {
  console.log("MongoDB disconnected");
  mongoConnectionGauge.set(0);
});

mongoose.connection.on('reconnected', () => {
  console.log("MongoDB reconnected");
  mongoConnectionGauge.set(1);
});