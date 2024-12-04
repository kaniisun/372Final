const cartModel = require("../models/cartModel");

const getCartItems = async (req, res) => {
  const userId = req.params.userId;
  try {
    const items = await cartModel.getCartItems(userId);
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addItemToCart = async (req, res) => {
  const { userId, productId, quantity } = req.body;
  try {
    if (!productId || quantity <= 0) {
      return res.status(400).json({ error: "Invalid product ID or quantity" });
    }

    let cart = await cartModel.getCartByUserId(userId);
    if (!cart) {
      const { cartId } = await cartModel.createCart(userId);
      await cartModel.addItemToCart(cartId, productId, quantity);
    } else {
      const cartId = cart.id;
      await cartModel.addItemToCart(cartId, productId, quantity);
    }

    const updatedCartItems = await cartModel.getCartItems(cart.id);
    res.status(200).json({ message: "Item added", cartItems: updatedCartItems });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateCartItem = async (req, res) => {
  const { cartProductId, quantity } = req.body;
  try {
    if (quantity <= 0) {
      return res.status(400).json({ error: "Quantity error" });
    }
    await cartModel.updateCartItem(cartProductId, quantity);
    res.status(200).json({ message: "Cart updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const removeItemFromCart = async (req, res) => {
  const { cartProductId } = req.params;
  try {
    await cartModel.removeItemFromCart(cartProductId);
    res.status(200).json({ message: "Item removed" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getCartItems,
  addItemToCart,
  updateCartItem,
  removeItemFromCart,
};