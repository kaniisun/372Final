const productsModel = require('../models/productModel');

const getAllProducts = (req, res) => {
    productsModel.getAllProducts((err, products) => {
        if (err) return res.status(500).json({ error: "DB error" });
        res.json(products);
    });
};

const getProductById = (req, res) => {
    const productId = parseInt(req.params.id);
    productsModel.getProductById(productId, (err, product) => {
        if (err) {
            console.error("DB error:", err);
            return res.status(500).json({ error: "DB error" });
        }
        if (!product) {
            console.warn("Product not found:", productId);
            return res.status(404).json({ message: "Product not found" });
        }
        res.json(product);
    });
};

const createProduct = (req, res) => {
    const newProduct = req.body;
    productsModel.createProduct(newProduct, (err, product) => {
        if (err) return res.status(500).json({ error: "DB error" });
        res.status(201).json(product);
    });
};

const updateProduct = (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;
    productsModel.updateProduct(id, updatedData, (err, product) => {
        if (err) return res.status(500).json({ error: "DB error" });
        res.json(product);
    });
};

const deleteProduct = (req, res) => {
    const { id } = req.params;
    productsModel.deleteProduct(id, (err, result) => {
        if (err) return res.status(500).json({ error: "DB error" });
        res.json(result);
    });
};

const getSimilarProducts = (req, res) => {
    const { id } = req.params;
    productsModel.getSimilarProducts(id, (err, products) => {
        if (err) return res.status(500).json({ error: "DB error" });
        res.json(products);
    });
};

const getTrendingProducts = (req, res) => {
    productsModel.getTrendingProducts((err, products) => {
      if (err) return res.status(500).json({ error: "DB error" });
      res.json(products);
    });
  };

  // attempt for search
  const searchProducts = (req, res) => {
    const searchQuery = req.query.q || ''; 
    const category = req.query.category || ''; 
  
    productsModel.searchProducts({ q: searchQuery, category }, (err, products) => {
      if (err) {
        return res.status(500).json({ error: "DB error" });
      }
      res.json(products); 
    });
  };


module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getSimilarProducts,
    getTrendingProducts,
    searchProducts,
}; 