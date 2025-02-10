const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  image: { type: String, required: true },
  heading: { type: String, required: true },
  paragraph: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Banner = mongoose.model('Banner', bannerSchema);

module.exports = Banner;
 