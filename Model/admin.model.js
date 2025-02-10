const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
    Email: {
    type: String,
    required: true,
  },
  AdminPassword: {
    type: String,
    required: true,
  }
});

module.exports = mongoose.model("Admin", AdminSchema);