let isAddingToCart = false;

// fetch products from server
async function fetchAllProducts() {
    try {
        const response = await fetch('/products');
        if (!response.ok) throw new Error("Failed to fetch products");

        const products = await response.json();

        const productsContainer = document.querySelector('.allproducts');
        productsContainer.innerHTML = "";
        products.forEach(product => {
            const productHTML = `
                <div class="product">
                    <div class="img">
                        <img src="${product.image}" alt="${product.product_name}">
                        <div class="icons">
                            <a href="/details.html?id=${product.product_id}">view</a>
                        </div>
                    </div>
                    <div class="content">
                        <h3>${product.product_name}</h3>
                        <div class="price">$${product.price}</div>
                    </div>
                </div>
            `;
            productsContainer.innerHTML += productHTML;
        });
    } catch (error) {
        console.error("Error fetching", error);
    }
}

// check if product id in URL
document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    if (productId) {
        await fetchProductDetails(productId);
    }
});

// fetch details of specific product
async function fetchProductDetails(productId) {
    try {
        const response = await fetch(`/products/${productId}`);
        const product = await response.json();

        document.querySelector('.product-info h1').textContent = product.product_name;
        document.querySelector('.product-info p').textContent = product.description;
        document.querySelector('.price').textContent = `$${product.price}`;
        document.querySelector('.product-image img').src = `/images/${product.image}`;

        const addToCartButton = document.querySelector('.add-to-cart');
        if (addToCartButton) {
            addToCartButton.addEventListener('click', () => {
                const quantity = parseInt(document.getElementById('quantity').value);
                addToCart(product.product_id, quantity);
            });
        }
    } catch (error) {
        console.error("Error fetching", error);
    }
}

// fetch similar products
async function fetchSimilarProducts() {
    try {
        const response = await fetch("/products");
        if (!response.ok) throw new Error("Failed to fetch");

        const products = await response.json();

        const productGrid = document.querySelector(".product-grid");
        productGrid.innerHTML = "";

        products.forEach(product => {
            const productDiv = document.createElement("div");
            productDiv.classList.add("sim-item");

            productDiv.innerHTML = `
                <img src="${product.image}" alt="${product.product_name}">
                <div class="sim-name">${product.product_name}</div>
                <div class="sim-price">$${product.price}</div>
                <button class="sim-add">Add to <i class='bx bxs-cart'></i></button>
            `;

            productGrid.appendChild(productDiv);
        });
    } catch (error) {
        console.error("Error fetching", error);
    }
}
document.addEventListener('click', (event) => {
    if (event.target.classList.contains('sim-add')) {
        const productId = event.target.dataset.id;
        const quantity = 1;
        addToCart(productId, quantity);
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const productId = new URLSearchParams(window.location.search).get("id");
    if (productId) {
        fetchProductDetails(productId);
        fetchSimilarProducts();
    } else {
        fetchAllProducts();
    }
});

// produdcts on homepage
async function fetchTrendingProducts() {
    try {
        const response = await fetch('/products');
        if (!response.ok) throw new Error("Failed to fetch trending products");

        const products = await response.json();
        const productsContainer = document.querySelector('.trending-products .products-container');
        productsContainer.innerHTML = "";

        products.forEach(product => {
            const productHTML = `
                <div class="product">
                    <div class="img">
                        <img src="${product.image}" alt="${product.product_name}">
                    </div>
                    <div class="content">
                        <h3>${product.product_name}</h3>
                        <div class="price">$${product.price}</div>
                        <a href="/details.html?id=${product.product_id}" class="btn">view</a>
                    </div>
                </div>
            `;
            productsContainer.innerHTML += productHTML;
        });
    } catch (error) {
        console.error("Error fetching trending products", error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    fetchTrendingProducts();
});

// cart.js

document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const cartId = urlParams.get("cartId");

    if (cartId)
        await fetchCartItems(cartId);

});

// get cart items 
async function fetchCartItems(cartId) {
    try {
        const response = await fetch(`/cart/${cartId}`);
        if (!response.ok) throw new Error("Failed to fetch cart items");

        const cartItems = await response.json();
        console.log("Cart items fetched:", cartItems);

        const cartItemsContainer = document.getElementById("cart-items");
        if (cartItems.length === 0) {
            cartItemsContainer.innerHTML = `<tr><td colspan="5">Your cart is empty</td></tr>`;
        } else {
            cartItemsContainer.innerHTML = "";
            const fragment = document.createDocumentFragment();
            cartItems.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>
                        <div class="cart-item">
                            <img src="${item.image}" alt="${item.name}">
                            <span>${item.name}</span>
                        </div>
                    </td>
                    <td>$${item.price.toFixed(2)}</td>
                    <td>
                        <input type="number" value="${item.quantity}" min="1" data-id="${item.cartItemId}">
                        <button class="btn update" data-id="${item.cartItemId}">Update</button>
                    </td>
                    <td>$${(item.price * item.quantity).toFixed(2)}</td>
                    <td>
                        <button class="btn remove" data-id="${item.cartItemId}">Remove</button>
                    </td>
                `;
                fragment.appendChild(row);
            });
            cartItemsContainer.appendChild(fragment);
            calculateCartSummary(cartItems);
        }
    } catch (error) {
        console.error("Error fetching cart:", error);
    }
}

// update
async function updateCartItem(id, quantity) {
    try {
        const response = await fetch(`/cart/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ quantity }),
        });

        if (!response.ok) throw new Error(`Failed to update item ${id}`);
        alert('Cart updated successfully');
    } catch (error) {
        console.error("Error updating:", error);
        alert("Failed to update cart.");
    }
}

// remove
async function removeCartItem(id) {
    try {
        const response = await fetch(`/cart/${id}`, { method: "DELETE" });

        if (!response.ok) throw new Error(`Failed to remove item ${id}`);
        alert('Item removed');
    } catch (error) {
        console.error("Error removing item:", error);
        alert("Failed to remove item");
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartId = sessionStorage.getItem('cartId');

    await fetchCartItems(cartId);

    cartItemsContainer.addEventListener('click', async (e) => {
        const target = e.target;
        const id = target.dataset.id;

        if (target.classList.contains('update')) {
            const quantityInput = document.querySelector(`input[data-id="${id}"]`);
            const quantity = parseInt(quantityInput.value);
            await updateCartItem(id, quantity);
            await fetchCartItems(cartId);
        } else if (target.classList.contains('remove')) {
            await removeCartItem(id);
            await fetchCartItems(cartId);
        }
    });
});

// calculate cart total
const TAX_RATE = 0.0675;
const DELIVERY_FEE = 10.00;

function calculateCartSummary(cartItems) {
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = subtotal * TAX_RATE;
    const total = subtotal + tax + DELIVERY_FEE;

    document.querySelector(".summary").innerHTML = `
        <p>Subtotal: $${subtotal.toFixed(2)}</p>
        <p>Tax (${(TAX_RATE * 100).toFixed(2)}%): $${tax.toFixed(2)}</p>
        <p>Delivery Fee: $${DELIVERY_FEE.toFixed(2)}</p>
        <p class="total">Total: $${total.toFixed(2)}</p>
    `;
}

document.addEventListener("DOMContentLoaded", async () => {
    await fetchCartItems();
    const productId = new URLSearchParams(window.location.search).get("id");
    if (productId) {
        fetchProductDetails(productId);
        fetchSimilarProducts();
    }
});

// add product to cart
async function addToCart(productId, quantity) {
    if (isAddingToCart) return;
    isAddingToCart = true;

    if (!productId || quantity <= 0) {
        alert("Invalid product ID or quantity");
        return;
    }

    const cartData = { productId, quantity };
    let cartId = sessionStorage.getItem('cartId');

    if (!cartId) {
        try {
            const response = await fetch('/cart', { method: 'POST' });
            const data = await response.json();
            cartId = data.cartId;
            sessionStorage.setItem('cartId', cartId);
            cartId = cartId + 1;
        } catch (error) {
            console.error('Error creating cart:', error);
            alert("Failed to create cart");
            isAddingToCart = false;
            return;
        }
    }

    try {
        const response = await fetch(`/cart/${cartId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(cartData)
        });

        if (!response.ok) {
            const errorDetails = await response.json();
            console.error("Failed to add to cart:", errorDetails);
            alert("Failed to add product");
            return;
        }

        const result = await response.json();
        console.log("Cart updated:", result.cart);
        alert("Product added to cart!");

        window.location.href = `/cart.html?cartId=${cartId}`;
    } catch (error) {
        console.error("Error adding to cart:", error);
        alert("Failed to add product");
    } finally {
        isAddingToCart = false;
    }
}

// checkout and empty cart
document.querySelector('.checkout').addEventListener('click', async () => {
    const cartId = sessionStorage.getItem('cartId');

    if (!cartId) {
        alert("No cart found.");
        return;
    }

    try {
        const response = await fetch(`/cart/${cartId}`, {
            method: 'DELETE',
        });

        if (!response.ok) throw new Error('Failed to empty cart');

        sessionStorage.removeItem('cartId');

        document.getElementById('cart-items').innerHTML = `<tr><td colspan="5">Your cart is empty</td></tr>`;
        document.querySelector(".summary").innerHTML = `<p>Your cart is empty.</p>`;

        alert("Cart has been cleared.");

    } catch (error) {
        console.error("Error clearing cart:", error);
        alert("Failed to clear cart.");
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const cartButton = document.querySelector('nav a[href="/cart.html"]');

    if (cartButton) {
        cartButton.addEventListener('click', (event) => {
            event.preventDefault();
            const cartId = sessionStorage.getItem('cartId');
            if (cartId) {
                cartId = cartId + 1;
                window.location.href = `/cart.html?cartId=${cartId}`;
            } else {
                window.location.href = '/cart.html';
            }
        });
    }
});

