const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const mongoose = require('mongoose');
const TreasRouter = require("./Router/treas.routes");
require('dotenv').config();

app.use(cors({ orgin: "http://localhost:3000" }));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/treas", TreasRouter);


mongoose.connect(process.env.MONGODB_URL)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.listen(8000, () => {
  console.log("server running...");
});
