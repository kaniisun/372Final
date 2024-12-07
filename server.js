"use strict";
const express = require("express");
const app = express();
const cartModel = require('./models/cartModel');
const productsRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const adminProductRoutes = require('./routes/adminProductRoutes');
const orderRoutes = require('./routes/orderRoutes')

const multer = require("multer");
app.use(multer().none());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const session = require('express-session');
app.use(session({
  secret: 'cupcake',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
}));
app.use(express.static(__dirname + "/public"));

app.use('/products', productsRoutes);
app.use('/cart', cartRoutes);
app.use('/admin/products', adminProductRoutes);
app.use('/orders', orderRoutes);

app.get('/products/:id', (req, res) => {
  const productId = req.params.id;
  const product = getProductById(productId);  

  if (product) {
      res.json(product);  
  } else {
      res.status(404).send('<h1>Product not found</h1>');  
  }
});

app.post('/products', (req, res) => {
  req.session.cart = req.session.cart || [];
  res.status(200).json(req.session.cart);
});

app.post('/cart', (req, res) => {
  req.session.cart = req.session.cart || [];
  const cartId = new Date().getTime(); 
  req.session.cartId = cartId;
  res.status(200).json({ cartId: cartId }); 
});

app.get('/cart/:cartId', async (req, res) => {
  const { cartId } = req.params;
  const cartItems = await cartModel.getCartItems(cartId);
  if (!cartItems) {
    return res.status(404).json({ error: "No items in cart" });
  }
  res.status(200).json(cartItems);
});

app.post('/cart/:cartId', (req, res) => {
  const { cartId } = req.params;
  const { productId, quantity } = req.body;

  if (!productId || quantity <= 0) {
      return res.status(400).json({ error: "Invalid product ID or quantity" });
  }

  req.session.cart = req.session.cart || [];

  const productIndex = req.session.cart.findIndex(item => item.productId === productId);
  if (productIndex !== -1) {
      req.session.cart[productIndex].quantity += quantity;
  } else {
      req.session.cart.push({ productId, quantity });
  }

  res.status(200).json({ message: "Product added to cart", cart: req.session.cart });
});

app.delete('/cart/:cartId', async (req, res) => {
  const { cartId } = req.params;

  try {
    const cart = await cartModel.getCartById(cartId);
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    await cartModel.clearCart(cartId); 
    res.json({ message: "Cart cleared successfully" });
  } catch (error) {
    console.error("Error clearing cart:", error.message);
    res.status(500).json({ error: "Failed to clear cart" });
  }
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, function () {
  console.log("App listening at http://localhost:" + PORT);
});

process.on("SIGINT", cleanUp);
function cleanUp() {
  console.log("Terminate signal received.");
  db_close();
  console.log("...Closing HTTP server.");
  server.close(() => {
    console.log("...HTTP server closed.")
  })
}