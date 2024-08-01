const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

dotenv.config();
const app = express();

async function connectToMongoDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("CONNECTED TO MONGODB");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
}

connectToMongoDB();
// mongoose.connect(process.env.MONGODB_URL, () => {
//   console.log("CONNECTED TO MONGODB");
// });

app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.listen(8000, () => {
  console.log("Server is running....");
});
