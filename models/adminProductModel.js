const db = require('./db');

// function and query to get products
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
      callback(err, null);
    } else {
      callback(null, rows);
    }
  });
};

// function and query to get product by id
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
      callback(err, null);
    } else {
      callback(null, row);
    }
  });
};

// function and query to add product
const addProduct = (productData, callback) => {
  const { name, category_id, description, price, url } = productData;
  const sql = `
      INSERT INTO products (name, categories_id, description, price, url)
      VALUES (?, ?, ?, ?, ?)
  `;
  db.run(sql, [name, category_id, description, price, url], function (err) {
    if (err) {
      callback(err);
    } else {
      callback(null, { id: this.lastID, ...productData });
    }
  });
};

// function and query to delete product
const deleteProduct = (id, callback) => {
  const sql =
    `DELETE FROM products WHERE id = ?`;
  db.run(sql, [id], function (err) {
    if (err) {
      callback(err);
    } else {
      callback(null, { id });
    }
  });
};

// search 
const searchProducts = (query, callback) => {
  const { name, category } = query;
  let sql = "SELECT * FROM products WHERE 1 = 1";
  const params = [];
  if (name) {
    sql += " AND name LIKE ?";
    params.push(`%${name}%`);
  }
  if (category) {
    sql += " AND category LIKE ?";
    params.push(`%${category}%`);
  }

  db.all(sql, params, (err, rows) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, rows);
    }
  });
};

// update 
const updateProduct = (id, updatedData, callback) => {
  const fields = Object.keys(updatedData).map((key) => `${key} = ?`).join(", ");
  const values = Object.values(updatedData);

  const sql = `
      UPDATE products
      SET ${fields}
      WHERE id = ?
  `;

  db.run(sql, [...values, id], function (err) {
    if (err) {
      callback(err);
    } else {
      callback(null, { id, ...updatedData });
    }
  });
};

module.exports = {
  getAllProducts,
  getProductById,
  addProduct,
  searchProducts,
  updateProduct,
  deleteProduct,
};