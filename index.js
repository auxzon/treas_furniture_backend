const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const mongoose = require('mongoose');
const TreasRouter = require("./Router/treas.routes");
require('dotenv').config();

// const allowedOrigins = [
//   "https://treasfurniture.com",
//   "https://www.treasfurniture.com",
//   "https://admin.treasfurniture.com"
// ];

// app.use(cors({
//   origin: function (origin, callback) {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   }
// }));
app.use(cors());

// const allowedOrigins = [
//   "https://treasfurniture.com",
//   "https://www.treasfurniture.com",
//   "https://admin.treasfurniture.com"
// ];

// app.use(cors({
//   origin: function (origin, callback) {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   }
// }));
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({extended:true}))

app.use(express.urlencoded({extended:true}))
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/treas", TreasRouter);

app.get("/", (req, res) => {
  res.send("<h1>Server is running. Check out <a href='https://treasfurniture.com'>Treas Furniture</a></h1>");
});
app.get("/", (req, res) => {
  res.send("<h1>Server is running. Check out <a href='https://treasfurniture.com'>Treas Furniture</a></h1>");
});

mongoose.connect(process.env.MONGODB_URL)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

  app.listen(4000, () => {
    console.log("Server running on http://localhost:4000");
  });