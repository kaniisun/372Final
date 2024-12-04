const express = require("express");
const router = express.Router();
const adminProductController = require("../controllers/adminProductController");

// admin routes
router.get("/", adminProductController.getAllProducts);
router.get("/:id", adminProductController.getProductById);  
router.post("/", adminProductController.addProduct);
router.get("/search", adminProductController.searchProducts);
router.put("/:id", adminProductController.updateProduct);
router.delete("/:id", adminProductController.deleteProduct);
router.post("/upload", adminProductController.uploadFile);
router.post("/bulk-upload", adminProductController.bulkUpload);


module.exports = router;