const db = require('./db');

// function and query for create a new cart
const createCart = () => {
  return new Promise((resolve, reject) => {
    const query = `INSERT INTO carts DEFAULT VALUES`;
    db.run(query, function (err) {
      if (err) return reject(err);
      resolve({ id: this.lastID });
    });
  });
};

// function and query for get all items in cart
const getCartItems = (cartId) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT cp.id AS cartItemId, p.name, cp.quantity, p.price, 
             (cp.quantity * p.price) AS totalPrice
      FROM cartProducts cp
      JOIN products p ON cp.product_id = p.id
      WHERE cp.carts_id = ?;
    `;
    db.all(query, [cartId], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

// function and query for add item to the cart
const addItemToCart = (cartId, productId, quantity) => {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO cartProducts (carts_id, product_id, quantity)
      VALUES (?, ?, ?)
      ON CONFLICT (carts_id, product_id)
      DO UPDATE SET quantity = quantity + excluded.quantity;
    `;
    db.run(query, [cartId, productId, quantity], (err) => {
      if (err) {
          console.error("Error executing query:", err);
          return reject(err);
      }
      console.log(`Product ${productId} added to cart ${cartId}`);
      resolve({ message: "Product added or quantity updated" });
    });
  });
};

// function and query for update cart item quantity
const updateCartItem = (itemId, quantity) => {
  return new Promise((resolve, reject) => {
    const query = `
      UPDATE cartProducts SET quantity = ? WHERE id = ?;
    `;
    db.run(query, [quantity, itemId], (err) => {
      if (err) return reject(err);
      resolve({ message: "Cart item updated" });
    });
  });
};

// function and query for remove item from the cart
const removeItemFromCart = (itemId) => {
  return new Promise((resolve, reject) => {
    const query = `
      DELETE FROM cartProducts WHERE id = ?;
    `;
    db.run(query, [itemId], (err) => {
      if (err) return reject(err);
      resolve({ message: "Item removed" });
    });
  });
};

// function and query for get cart by id
const getCartById = (cartId) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM carts WHERE id = ?;`;
    db.get(query, [cartId], (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
};

// function and query for clear cart
const clearCart = (cartId) => {
  return new Promise((resolve, reject) => {
    const query = `DELETE FROM cartProducts WHERE carts_id = ?;`;
    db.run(query, [cartId], (err) => {
      if (err) return reject(err);
      resolve({ message: "Cart cleared" });
    });
  });
};

module.exports = {
  createCart,
  getCartItems,
  addItemToCart,
  updateCartItem,
  removeItemFromCart,
  getCartById,
  clearCart,
};