const adminProductModel = require("../models/adminProductModel");

const getAllProducts = (req, res) => {
  adminProductModel.getAllProducts((err, products) => {
    if (err) {
      res.status(500).json({ message: "Error fetching" });
    } else {
      res.json(products);
    }
  });
};

const getProductById = (req, res) => {
  const { id } = req.params;
  adminProductModel.getProductById(id, (err, product) => {
    if (err) {
      res.status(500).json({ message: "Error fetching product" });
    } else if (!product) {
      res.status(404).json({ message: "Product not found" });
    } else {
      res.json(product);
    }
  });
};

const addProduct = (req, res) => {
  adminProductModel.addProduct(req.body, (err, newProduct) => {
    if (err) {
      res.status(500).json({ message: "Error adding product" });
    } else {
      res.status(201).json({ message: "Product added", product: newProduct });
    }
  });
};

const updateProduct = (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  adminProductModel.updateProduct(id, updatedData, (err, updatedProduct) => {
    if (err) {
      return res.status(500).json({ message: "Error updating" });
    }
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product updated", product: updatedProduct });
  });
};

const deleteProduct = (req, res) => {
  const { id } = req.params;

  adminProductModel.getProductById(id, (err, product) => {
    if (err) {
      return res.status(500).json({ message: "Error fetching product" });
    }

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    adminProductModel.deleteProduct(id, (err) => {
      if (err) {
        return res.status(500).json({ message: "Error deleting" });
      }
      res.json({ message: "Product deleted" });
    });
  });
};

const bulkUpload = (req, res) => {
  const products = req.body;

  if (!Array.isArray(products) || products.length === 0) {
    return res.status(400).json({ message: "Invalid JSON format" });
  }

  const successfulInserts = [];
  const failedInserts = [];

  products.forEach(async (productData) => {
    const { product_name, category, price, description, image } = productData;

    if (!product_name || !category || !price || !description || !image) {
      failedInserts.push({ product: productData, error: "Missing fields." });
      return;
    }

    try {
      const sql = `
              INSERT INTO products (name, categories_id, description, price, url)
              VALUES (?, ?, ?, ?, ?)
          `;

      const categorySql = `SELECT id FROM categories WHERE name = ?`;
      db.get(categorySql, [category], (err, categoryRow) => {
        if (err || !categoryRow) {
          failedInserts.push({ product: productData, error: "Category not found" });
        } else {
          const category_id = categoryRow.id;
          db.run(sql, [product_name, category_id, description, price, image], function (err) {
            if (err) {
              failedInserts.push({ product: productData, error: err.message });
            } else {
              successfulInserts.push({ product_id: this.lastID, ...productData });
            }
          });
        }
      });
    } catch (err) {
      failedInserts.push({ product: productData, error: err.message });
    }
  });

  setTimeout(() => {
    const message = `${successfulInserts.length} products uploaded, ${failedInserts.length} failed.`;
    res.json({ message, successfulInserts, failedInserts });
  }, 2000);
};

const searchProducts = (req, res) => {
  const { query } = req;
  const results = adminProductModel.searchProducts(query);
  res.json(results);
};

const uploadFile = (req, res) => {
  const file = req.files?.image;

  if (!file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const imageUrl = `/uploads/${file.filename}`;
  res.json({ imageUrl });
};

module.exports = {
  getAllProducts,
  getProductById,
  addProduct,
  searchProducts,
  updateProduct,
  deleteProduct,
  uploadFile,
  bulkUpload,
};