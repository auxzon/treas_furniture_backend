const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
    },
    productPrice: {
      type: Number,
      required: true,
    },
    productActualPrice: {
      type: Number,
      required: true,
    },
    productDetails: {
      type: String,
      required: true,
    },
   productMoreImage: {
      type: Array,
      required: false,
    },
    material: {
      type: String,
      required: false,
    },
    colour: {
      type: String,
      required: false,
    },
    productCategory: {
      type: String,
      required: false,
    },
    productCategoryName: {
      type: String,
      required: false,
    },
    dimensions: {
      type: String,
      required: false,
    },
    recomandedUsesFor: {
      type: String,
      required: false,
    },
    moreDetails: [
      {
        image: {
          type: String,
          required: false,
        },
        heading: {
          type: String,
          required: false,
        },
        paragraph: {
          type: String,
          required: false,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
