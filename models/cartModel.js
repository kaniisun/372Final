const db = require('./db');

// function and query to get cart items
const getCartItems = (cartId) => {
  return new Promise((resolve, reject) => {
    const query = `
          SELECT cp.id, p.name, cp.quantity, p.price, (cp.quantity * p.price) AS total_price
          FROM cartProducts cp
          JOIN products p ON cp.products_id = p.id
          WHERE cp.carts_id = ?;
      `;
    db.all(query, [cartId], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

// function and query to add to cart and update quanitity
const addItemToCart = (cartId, productId, quantity) => {
  return new Promise((resolve, reject) => {
    if (!productId || quantity <= 0) {
      return reject(new Error("Invalid quantity"));
    }

    db.get(`SELECT id FROM products WHERE id = ?`, [productId], (err, product) => {
      if (err) return reject(err);
      if (!product) return reject(new Error("Product not found"));

      db.get(`SELECT id FROM cartProducts WHERE carts_id = ? AND products_id = ?`, [cartId, productId], (err, existingProduct) => {
        if (err) return reject(err);

        if (existingProduct) {
          db.run(
            `UPDATE cartProducts SET quantity = quantity + ? WHERE carts_id = ? AND products_id = ?`,
            [quantity, cartId, productId],
            (err) => {
              if (err) return reject(err);
              resolve({ message: "Quantity updated" });
            }
          );
        } else {
          db.run(
            `INSERT INTO cartProducts (carts_id, products_id, quantity) VALUES (?, ?, ?)`,
            [cartId, productId, quantity],
            (err) => {
              if (err) return reject(err);
              resolve({ message: "Product added to cart" });
            }
          );
        }
      });
    });
  });
};

// function and query to update cart
const updateCartItem = (itemId, quantity) => {
  return new Promise((resolve, reject) => {
    if (!quantity || quantity <= 0) {
      return reject(new Error("Invalid quantity"));
    }

    db.run(`UPDATE cartProducts SET quantity = ? WHERE id = ?`, [quantity, itemId], (err) => {
      if (err) return reject(err);
      resolve({ message: "Quantity updated" });
    });
  });
};

// function and query to remove item
const removeItemFromCart = (itemId) => {
  return new Promise((resolve, reject) => {
    db.run(`DELETE FROM cartProducts WHERE id = ?`, [itemId], (err) => {
      if (err) return reject(err);
      resolve({ message: "Item removed from cart" });
    });
  });
};

const getCartByUserId = (userId) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM carts WHERE users_id = ?`;
    db.get(query, [userId], (err, row) => {
      if (err) return reject(err);
      if (!row) return resolve(null);
      resolve(row);
    });
  });
};

const createCart = async (userId) => {
  let cart = await getCartByUserId(userId);
  if (!cart) {
    cart = await createCart(userId);
  }
  return cart;
};

const addToCart = async (productId, quantity, userId) => {
  try {
    const cart = await getOrCreateCart(userId);
    if (!cart) {
      throw new Error("Failed to create");
    }

    await addItemToCart(cart.cartId, productId, quantity);
  } catch (error) {
  }
};

module.exports = {
  getCartItems,
  addToCart,
  addItemToCart,
  getCartByUserId,
  updateCartItem,
  removeItemFromCart,
  createCart,
};