const Product = require("../Model/Product.model");

const addProduct = async (req, res) => {
  try {
    const {
      productName,
      productPrice,
      productActualPrice,
      productDetails,
      material,
      colour,
      productCategory,
      dimensions,
      recomandedUsesFor,
    } = req.body;


    const productMoreImage = req.files["productMoreImage"]
      ? req.files["productMoreImage"].map((file) => file.path)
      : [];

    const newProduct = new Product({
      productName,
      productPrice,
      productActualPrice,
      productDetails,
      productMoreImage,
      material,
      colour,
      productCategory,
      dimensions,
      recomandedUsesFor,
    });

    const savedProduct = await newProduct.save();
    res
      .status(201)
      .json({ message: "Product added successfully", product: savedProduct });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding product", error: error.message });
  }
};

const editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateFields = { ...req.body };

    if (req.files["productImage"]) {
      updateFields.productImage = req.files["productImage"][0].path;
    }

    if (req.files["productMoreImage"]) {
      const newImages = req.files["productMoreImage"].map((file) => file.path);
      const product = await Product.findById(id);

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      updateFields.productMoreImage = [
        ...product.productMoreImage,
        ...newImages,
      ];
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updateFields, {
      new: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating product", error: error.message });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching products", error: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching product", error: error.message });
  }
};

module.exports = {
  addProduct,
  editProduct,
  getAllProducts,
  getProductById,
};
