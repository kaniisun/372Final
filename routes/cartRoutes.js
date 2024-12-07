const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");

// cart routes
router.get("/", cartController.getCartItems); 
router.get("/:cartId", cartController.getCartItems); 
router.post("/", cartController.createCart); 
router.post("/:cartId", cartController.addItemToCart); 
router.put("/:cartId/:itemId", cartController.updateCartItem); 
router.delete("/:cartId/:itemId", cartController.removeItemFromCart); 

module.exports = router;