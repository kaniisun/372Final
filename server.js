"use strict";
const express = require("express");
const app = express();
const productsRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const adminProductRoutes = require('./routes/adminProductRoutes');
const orderRoutes = require('./routes/orderRoutes')

const multer = require("multer");
app.use(multer().none());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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