const db = require('./db');

// function and query to get all products in db
const getAllProducts = (callback) => {
  const sql = `
      SELECT 
          products.id AS product_id,
          products.name AS product_name,
          categories.name AS category,
          products.description,
          products.price,
          products.url AS image
      FROM products
      JOIN categories ON products.categories_id = categories.id
  `;
  db.all(sql, [], (err, rows) => {
    if (err) {
      callback(err);
    } else {
      callback(null, rows);
    }
  });
};

// function and query to a product by id in db
const getProductById = (id, callback) => {
  const sql = `
      SELECT 
          products.id AS product_id,
          products.name AS product_name,
          categories.name AS category,
          products.description,
          products.price,
          products.url AS image
      FROM products
      JOIN categories ON products.categories_id = categories.id
      WHERE products.id = ?
  `;
  db.get(sql, [id], (err, row) => {
    if (err) {
      callback(err);
    } else {
      callback(null, row);
    }
  });
};

// function and query to create product in db
const createProduct = (product, callback) => {
  const sql = `
      INSERT INTO products (categories_id, name, description, price, url, created_by)
      VALUES (?, ?, ?, ?, ?, ?)
  `;
  const params = [
    product.categories_id,
    product.name,
    product.description,
    product.price,
    product.url,
    product.created_by
  ];
  db.run(sql, params, function (err) {
    if (err) {
      callback(err);
    } else {
      callback(null, { product_id: this.lastID, ...product });
    }
  });
};

// function and query to update product in db
const updateProduct = (id, updatedData, callback) => {
  const sql = `
      UPDATE products
      SET categories_id = ?, name = ?, description = ?, price = ?, url = ?
      WHERE id = ?
  `;
  const params = [
    updatedData.categories_id,
    updatedData.name,
    updatedData.description,
    updatedData.price,
    updatedData.url,
    id
  ];
  db.run(sql, params, function (err) {
    if (err) {
      callback(err);
    } else {
      callback(null, { product_id: id, ...updatedData });
    }
  });
};

// function and query to delete product in db
const deleteProduct = (id, callback) => {
  const sql = `DELETE FROM products WHERE id = ?`;
  db.run(sql, [id], function (err) {
    if (err) {
      callback(err);
    } else {
      callback(null, { message: `Product ${id} deleted` });
    }
  });
};

// function and query to get similar products in db
const getSimilarProducts = (id, callback) => {
  const sql = `
      SELECT 
          products.id AS product_id,
          products.name AS product_name,
          products.description,
          products.price,
          products.url AS image
      FROM products
      WHERE products.id != ?
      LIMIT 3
  `;
  db.all(sql, [id], (err, rows) => {
    if (err) {
      callback(err);
    } else {
      callback(null, rows);
    }
  });
};

// function and query for products on homepage
const getTrendingProducts = (callback) => {
  const sql = `
      SELECT 
          products.id AS product_id,
          products.name AS product_name,
          categories.name AS category,
          products.description,
          products.price,
          products.url AS image
      FROM products
      JOIN categories ON products.categories_id = categories.id
      WHERE products.is_trending = 1
      LIMIT 5
  `;
  db.all(sql, [], (err, rows) => {
    if (err) {
      callback(err);
    } else {
      callback(null, rows);
    }
  });
};

// attempt for search
const searchProducts = (searchQuery, callback) => {
  let query = 'SELECT * FROM products WHERE name LIKE ?';
  let params = [`%${searchQuery.q}%`];

  if (searchQuery.category) {
    query += ' AND category = ?';
    params.push(searchQuery.category);
  }

  db.all(query, params, (err, results) => {
    if (err) return callback(err);
    callback(null, results);
  });
};


module.exports = {
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getSimilarProducts,
  getAllProducts,
  getTrendingProducts,
  searchProducts,
};