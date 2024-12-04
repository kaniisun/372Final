const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// orders route
router.get('/', orderController.getOrders);

module.exports = router;