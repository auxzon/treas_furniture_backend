const express = require('express');
const router = express.Router();
const productController = require('../Controller/product.controller'); 
const upload = require('../Middleware/Multer'); 


// router.post(
//   '/add',
//   upload.fields([
   
//     { name: 'productMoreImage', maxCount: 5 },
//   ]),
//   productController.addProduct
// );






router.get('/all', productController.getAllProducts);
router.get('/:id', productController.getProductById);

module.exports = router;
