const cartModel = require("../models/cartModel");

const createCart = async (req, res) => {
  try {
    const newCart = await cartModel.createCart();
    console.log("New Cart Created with ID:", newCart.id);
    res.status(201).json({ message: "Cart created", cartId: newCart.id });
  } catch (error) {
    console.error("Error creating cart:", error.message);
    res.status(500).json({ error: "Failed to create cart" });
  }
};

const getCartItems = async (req, res) => {
  const { cartId } = req.params;
  console.log("Fetching items for cart:", cartId);
  try {
    const items = await cartModel.getCartItems(cartId);
    console.log("Items fetched:", items);
    res.status(200).json(items);
  } catch (error) {
    console.error("Error fetching cart", error.message);
    res.status(500).json({ error: "Failed to fetch cart" });
  }
};

const addItemToCart = async (req, res) => {
  const { productId, quantity } = req.body;

  let cartId = req.session.cart; 
  if (!cartId) {
    try {
      const newCart = await cartModel.createCart();
      cartId = newCart.id;
      req.session.cart = cartId; 
    } catch (error) {
      console.error("Error creating cart:", error.message);
      return res.status(500).json({ error: "Failed to create cart" });
    }
  }

  try {
    await cartModel.addItemToCart(cartId, productId, quantity);
    const updatedCart = await cartModel.getCartItems(cartId);
    res.status(201).json({ message: "Item added to cart", cart: updatedCart });
  } catch (error) {
    console.error("Error adding item to cart:", error.message);
    res.status(500).json({ error: "Failed to add to cart" });
  }
};

const updateCartItem = async (req, res) => {
  const { cartId, itemId } = req.params;
  const { quantity } = req.body;
  try {
    if (quantity <= 0) {
      return res.status(400).json({ error: "Invalid quantity" });
    }

    await cartModel.updateCartItem(itemId, quantity);
    const updatedCart = await cartModel.getCartItems(cartId);
    res.status(200).json({ message: "Cart item updated", cart: updatedCart });
  } catch (error) {
    console.error("Error updating cart:", error.message);
    res.status(500).json({ error: "Failed to update cart" });
  }
};

const removeItemFromCart = async (req, res) => {
  const { itemId } = req.params;
  try {
    await cartModel.removeItemFromCart(itemId);
    res.status(200).json({ message: "Item removed from cart" });
  } catch (error) {
    console.error("Error removing item:", error.message);
    res.status(500).json({ error: "Failed to remove item" });
  }
};

module.exports = {
  createCart,
  getCartItems,
  addItemToCart,
  updateCartItem,
  removeItemFromCart,
};