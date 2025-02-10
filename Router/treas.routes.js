const express = require("express");
const router = express.Router();
const adminController = require("../Controller/admin.controller");
const Product = require("../Model/Product.model");
const upload = require("../Middleware/Multer");
const Banner = require("../Model/Banner.model");

// router.post(
//    "/Addproduct",
//    upload.single("productImage"),
//    adminController.addProduct
// );

router.post("/AddCategory", adminController.addCategory);
router.post("/login", adminController.userLogin);
router.get("/getallProducts", adminController.getProducts);

router.post(
  "/add",
  upload.fields([
    { name: "productMoreImage", maxCount: 5 },
    { name: "moreDetailsImages", maxCount: 10 },
  ]),
  adminController.addProduct
);

router.put(
  "/edit-product/:productId",
  upload.fields([{ name: "productMoreImage" }, { name: "moreDetailsImages" }]),
  adminController.editProduct
);

router.post(
  "/AddProductMoreImages",
  upload.array("productMoreImage", 5),
  adminController.addProductMoreImages
);

router.get("/Getproductss", adminController.getAllProducts);
router.get("/GetIndexproducts", adminController.IndexPagegetProducts);
router.get("/Getcategory", adminController.getAllCategories);



router.get("getproduct/:id", adminController.getProductById);

router.post("/upload", upload.single("image"), adminController.addImage);
router.post("/Contact", adminController.Contact);
router.get("/images", adminController.getImages);
router.post("/forgotpassword", adminController.forgotPassword);

router.delete("/banner/:bannerId", adminController.deleteBanner);
router.delete("/products/:productId", adminController.DeleteProduct);
router.get("/banners", adminController.getAllBanners);
router.post("/reset-password", adminController.resetPassword);

router.get("/products/:productId", async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.productId });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.post("/banner/:id", upload.single("image"), async (req, res) => {
  const { heading, paragraph } = req.body;
  const bannerId = req.params.id;
  try {
    const banner = await Banner.findById(bannerId);
    if (!banner) {
      return res.status(404).json({ ok: false, message: "Banner not found" });
    }
    banner.heading = heading || banner.heading;
    banner.paragraph = paragraph || banner.paragraph;
    if (req.file) {
      banner.image = req.file ? req.file.path.replace(/\\/g, "/") : null;
    }
    await banner.save();
    res
      .status(200)
      .json({ ok: true, message: "Banner updated successfully", banner });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, message: "Server error" });
  }
});

module.exports = router;
