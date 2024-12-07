const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productController');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

// product routes
router.get('/', productsController.getAllProducts);
router.get('/:id', productsController.getProductById);
router.post('/', productsController.createProduct);
router.put('/:id', productsController.updateProduct);
router.delete('/:id', productsController.deleteProduct);
router.get("/:id/similar", productsController.getSimilarProducts);
router.get('/search', productsController.searchProducts);

module.exports = router;