const Product = require("../Model/Product.model");
const Category = require("../Model/Category.model");
// const uuid = require("uuid");
const Image = require("../Model/Image.model");
const { v4: uuidv4 } = require("uuid");
const sendEmail = require("../Middleware/nodeMailer");
const Banner = require("../Model/Banner.model");
const User = require("../Model/admin.model");
const upload = require("../Middleware/Multer");

exports.userLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ Email: username });
    if (!user) {
      return res.status(400).json({ message: "Invalid email" });
    }

    if (user.AdminPassword === password) {
      res.status(200).json({
        message: "Login successful",
        userId: user._id,
      });
    } else {
      return res.status(400).json({ message: "Invalid password" });
    }
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.addProduct = async (req, res) => {
  try {
    const {
      productName,
      productPrice,
      productActualPrice,
      productDetails,
      material,
      colour,
      productCategory,
      productCategoryName,
      dimensions,
      recomandedUsesFor,
      moreDetails,
    } = req.body;

    const productMoreImage = req.files['productMoreImage']
      ? req.files['productMoreImage'].map((file) => file.path)
      : [];

    let parsedMoreDetails = [];
    if (moreDetails) {
      const detailsArray = JSON.parse(moreDetails);
      parsedMoreDetails = detailsArray.map((detail, index) => ({
        image: req.files['moreDetailsImages'] && req.files['moreDetailsImages'][index]
          ? req.files['moreDetailsImages'][index].path
          : null,
        heading: detail.heading,
        paragraph: detail.paragraph,
      }));
    }

    const newProduct = new Product({
      productName,
      productPrice,
      productActualPrice,
      productDetails,
      productCategoryName,
      productMoreImage,
      material,
      colour,
      productCategory,
      dimensions,
      recomandedUsesFor,
      moreDetails: parsedMoreDetails,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json({ message: 'Product added successfully', product: savedProduct });
  } catch (error) {
    res.status(500).json({ message: 'Error adding product', error: error.message });
  }
};


exports.editProduct = async (req, res) => {
  try {
    const productId = req.params.productId;
    const {
      productName,
      productPrice,
      productActualPrice,
      productDetails,
      material,
      colour,
      productCategory,
      productCategoryName,
      dimensions,
      recomandedUsesFor,
      moreDetails,
    } = req.body;
 const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
  if (req.body.productMoreImage) {
      try {
        const newImages = JSON.parse(req.body.productMoreImage);
        product.productMoreImage = newImages;
      } catch (error) {
        return res.status(400).json({ message: "Invalid product images format" });
      }
    }
    let parsedMoreDetails = product.moreDetails;
    if (moreDetails) {
      try {
        const detailsArray = JSON.parse(moreDetails);
        parsedMoreDetails = detailsArray.map((detail) => ({
          image: detail.image,
          heading: detail.heading,
          paragraph: detail.paragraph,
        }));
      } catch (error) {
        return res.status(400).json({ message: "Invalid moreDetails format" });
      }
    }
 
    product.productName = productName || product.productName;
    product.productPrice = productPrice || product.productPrice;
    product.productActualPrice = productActualPrice || product.productActualPrice;
    product.productDetails = productDetails || product.productDetails;
    product.material = material || product.material;
    product.colour = colour || product.colour;
    product.productCategory = productCategory || product.productCategory;
    product.productCategoryName = productCategoryName || product.productCategoryName;
    product.dimensions = dimensions || product.dimensions;
    product.recomandedUsesFor = recomandedUsesFor || product.recomandedUsesFor;
    product.moreDetails = parsedMoreDetails;
 
    const updatedProduct = await product.save();
 
    res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
  } catch (error) {
    res.status(500).json({ message: "Error updating product", error: error.message });
  }
};

exports.deleteProductImage = async (req, res) => {
  try {
    const { productId, imageUrl, type } = req.body; 

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (type === "productMoreImage") {
      product.productMoreImage = product.productMoreImage.filter((img) => img !== imageUrl);
    } else if (type === "moreDetailsImages") {
      product.moreDetails = product.moreDetails.map((detail) => {
        if (detail.image === imageUrl) {
          detail.image = null; 
        }
        return detail;
      });
    } else {
      return res.status(400).json({ message: "Invalid type specified" });
    }

    await product.save();
    res.status(200).json({ message: "Image deleted successfully", product });
  } catch (error) {
    res.status(500).json({ message: "Error deleting image", error: error.message });
  }
};




// exports.editProduct = async (req, res) => {
//   const { productId } = req.params;
 
  
//   const {
//     productName,
//     productDetails,
//     material,
//     dimensions,
//     colour,
//     productPrice,
//     productActualPrice,
//     productCategory,
//     productCategoryName,
//     moreDetails,  
//   } = req.body;

//   try {
//     // Find the existing product
//     const product = await Product.findById(productId);
//     if (!product) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     // Handle images (existing ones, no new uploads)
//     const existingMoreDetails = product.moreDetails || [];  // Get existing moreDetails

//     // Parse the moreDetails (headings and paragraphs)
//     let parsedMoreDetails = [];
//     if (moreDetails) {
//       const detailsArray = JSON.parse(moreDetails);
//       parsedMoreDetails = detailsArray.map((detail, index) => ({
//         image: existingMoreDetails[index]?.image || null,  // Keep the existing image, no change
//         heading: detail.heading,
//         paragraph: detail.paragraph,
//       }));
//     }

//     // Update product details
//     product.productName = productName;
//     product.productDetails = productDetails;
//     product.material = material;
//     product.dimensions = dimensions;
//     product.colour = colour;
//     product.productPrice = productPrice;
//     product.productActualPrice = productActualPrice;
//     product.productCategory = productCategory;
//     product.productCategoryName = productCategoryName;
//     product.moreDetails = parsedMoreDetails;  // Only update the content (heading and paragraph)

//     // Save updated product
//     await product.save();
//     res.status(200).json({ message: "Product updated successfully", product });
//   } catch (error) {
//     console.error("Error updating product:", error);
//     res.status(500).json({ message: "Failed to update product" });
//   }
// };








exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
};



exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error: error.message });
  }
};


exports.addCategory = async (req, res) => {
  const { categoryName } = req.body;

  try {
    const categoryId = uuidv4().slice(0, 3);
    const newcategory = new Category({
      categoryId,
      categoryName,
    });

    await newcategory.save();
    res
      .status(201)
      .json({ message: "Product added successfully", product: newcategory });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.editCategory = async (req, res) => {
  try {
    const { categoryId } = req.params; // Custom categoryId (not _id)
    const { categoryName } = req.body;

    console.log("Request Body:", req.body);
    console.log("Category ID:", categoryId);

    // ✅ Step 1: Check if the Category Exists First
    const categoryExists = await Category.findOne({ categoryId: categoryId });

    if (!categoryExists) {
      return res.status(404).json({ message: "Category not found" });
    }

    // ✅ Step 2: Update the Category Name
    const updatedCategory = await Category.findOneAndUpdate(
      { categoryId: categoryId },  // <-- FIXED HERE
      { categoryName },
      { new: true }
    );

    // ✅ Step 3: Update Product Name in Product Collection
    await Product.updateMany(
      { productCategory: categoryId },  // <-- FIXED HERE
      { productCategoryName: categoryName }
    );

    // ✅ Step 4: Send Response
    res.status(200).json({
      message: "Category and related products updated successfully",
      updatedCategory
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};










exports.deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.params; // Custom categoryId (not _id)

    // ✅ Step 1: Check if any products exist under this categoryId
    const existingProducts = await Product.find({ productCategory: categoryId });

    if (existingProducts.length > 0) {
      // ✅ Step 2: Prevent deletion if products exist
      return res.status(400).json({
        success: false,
        message: "Cannot delete this category. Products exist under this category.",
      });
    }

    // ✅ Step 3: Delete the category if no products exist
    const deletedCategory = await Category.findOneAndDelete({ categoryId });

    if (!deletedCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // ✅ Step 4: Send success response
    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};



exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 }); // Sort by latest first

    res.json({
      categories,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};




exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.IndexPagegetProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 }).limit(6);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const skip = (page - 1) * limit;

    const category = req.query.categoryId || "";
    const minPrice = parseFloat(req.query.minPrice) || 0;
    const maxPrice = parseFloat(req.query.maxPrice) || Number.MAX_VALUE;

    const query = {
      productPrice: { $gte: minPrice, $lte: maxPrice },
    };
    if (category) {
      query.productCategory = category;
    }

    
    const products = await Product.find(query)
      .sort({ createdAt: -1 }) 
      .skip(skip)
      .limit(limit);

    const totalProducts = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / limit);

    res.json({
      products,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.addProductMoreImages = async (req, res) => {

  const { productId } = req.body;

  const productMoreImages = req.files.map((file) => file.path);

  try {
    const product = await Product.findOne({ _id: productId });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.productMoreImage.push(...productMoreImages);
    await product.save();
    res.status(200).json({ message: "Images added successfully", product });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}; 


exports.addImage = async (req, res) => {
  try {
    const newImage = new Image({
      imageName: req.file.originalname,
      imagePath: req.file.path,
      productId: req.body.productId,
    });

    await newImage.save();
    res
      .status(201)
      .json({ message: "Image uploaded successfully", image: newImage });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getImages = async (req, res) => {
  try {
    const images = await Image.find();
    res.status(200).json(images);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addOrUpdateBanner = async (req, res) => {
  upload.single("image")(req, res, async function (err) {
    const { bannerId, heading, paragraph } = req.body;
    const image = req.file ? req.file.path.replace(/\\/g, "/") : null;

    if (err) {
      return res
        .status(400)
        .json({ success: false, message: "File upload failed." });
    }

    try {
      const banner = await Banner.findByIdAndUpdate(
        bannerId,
        { heading, paragraph, image },
        { new: true, upsert: true }
      );
      res.status(200).json({ success: true, banner });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  });
};

exports.deleteBanner = async (req, res) => {
  try {
    const { bannerId } = req.params;
    const banner = await Banner.findByIdAndDelete(bannerId);
    if (!banner) {
      return res.status(404).json({ error: "Banner not found" });
    }
    return res.status(200).json({ message: "Banner deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};



exports.getAllBanners = async (req, res) => {
  try {
    const banners = await Banner.find();
    return res.status(200).json({ banners });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.DeleteProduct = async (req, res) => {
  const { productId } = req.params;

  try {
    const result = await Product.deleteOne({ _id:productId});

    if (result.deletedCount > 0) {
      res.status(200).json({ message: "Product deleted successfully!" });
    } else {
      res.status(404).json({ message: "Product not found." });
    }
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Server error while deleting product." });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const admin = await User.findOne({ Email: email });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    admin.AdminPassword = otp;
    await admin.save();

    await sendEmail(
      email,
      "New password",
      `Your New password is ${otp}. `
    );

    res.status(201).json({ message: "OTP sent to your email" });
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.resetPassword = async (req, res) => {
  const { userId, currentPassword, newPassword, confirmPassword } = req.body;

  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (currentPassword !== user.AdminPassword) {
    return res.status(400).json({ message: "Current password is incorrect" });
  }

  if (newPassword !== confirmPassword) {
    return res
      .status(400)
      .json({ message: "New password and confirm password do not match" });
  }

  user.AdminPassword = newPassword;

  await user.save();

  res.status(200).json({ message: "Password reset successful" });
};

exports.Contact = (req, res) => {
  const { subjects, name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const subject = subjects;
  const text = `Name: ${name}\nEmail: ${email}\nMessage: ${message}`;

  sendEmail(process.env.EMAIL_TO_CONTACT, subject, text)
    .then((info) => {
      res.status(200).send("Your Message Sended Successfully");
    })
    .catch((error) => {
      console.error("Error sending email:", error);
      res.status(500).send("Error submitting form");
    });
};
