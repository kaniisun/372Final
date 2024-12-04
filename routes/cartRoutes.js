const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");

// cart routes
router.get("/", cartController.getCartItems);
router.post("/", cartController.addItemToCart);
router.put("/:id", cartController.updateCartItem);
router.delete("/:id", cartController.removeItemFromCart);

module.exports = router;