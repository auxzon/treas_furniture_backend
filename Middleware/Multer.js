// const multer = require('multer');
// const path = require('path');


// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/ProductsIMG');
//   },
//   filename: function (req, file, cb) {
   
//     cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
//   }
// });
 
// const upload = multer({
//   storage: storage,
//   fileFilter: function (req, file, cb) {
//     const fileTypes = /jpeg|jpg|png/;
//     const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
//     const mimetype = fileTypes.test(file.mimetype);

//     if (mimetype && extname) {
//       return cb(null, true);
//     } else {
//       cb('Error: Images only!');
//     }
//   }
// });

// module.exports = upload;

// const multer = require('multer');
// const path = require('path');

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'uploads'); 
//     },
//     filename: function (req, file, cb) {
//         cb(null, Date.now() + '-' + file.originalname);
//     },
// });

// const fileFilter = (req, file, cb) => {
//     const allowedTypes = /jpeg|jpg|png|jfif|gif/;
//     const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
//     const mimetype = allowedTypes.test(file.mimetype);

//     if (extname && mimetype) {
//         return cb(null, true);
//     } else {
//         cb('Error: Images Only!');
//     }
// };

// const upload = multer({
//     storage: storage,
//     // limits: { fileSize: 1024 * 1024 * 5 }, 
//     fileFilter: fileFilter,
// });

// module.exports = upload;
const multer = require('multer');
const cloudinary = require('../utils/cloudinary'); 
const { CloudinaryStorage } = require('multer-storage-cloudinary');


const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder:'product_images',
      allowed_formats: ['jpeg', 'jpg', 'png', 'jfif', 'gif'],
      public_id: (req, file) => Date.now() + '-' + file.originalname.split('.')[0],
    },
  });
  
const upload = multer({ storage });

module.exports = upload;



