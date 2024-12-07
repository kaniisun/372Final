

// fetch items and display
async function fetchCartItems() {
    try {
        const response = await fetch('/cart');
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
                            <img src="/images/${item.name.toLowerCase().replace(/\s/g, '')}.png" alt="${item.name}">
                            <span>${item.name}</span>
                        </div>
                    </td>
                    <td>$${item.price.toFixed(2)}</td>
                    <td>
                        <input type="number" value="${item.quantity}" min="1" data-id="${item.id}">
                        <button class="btn update" data-id="${item.id}">Update</button>
                    </td>
                    <td>$${(item.price * item.quantity).toFixed(2)}</td>
                    <td>
                        <button class="btn remove" data-id="${item.id}">Remove</button>
                        <button class="save">Save for Later</button>
                    </td>`;
                fragment.appendChild(row);
            });
            cartItemsContainer.appendChild(fragment);
            calculateCartSummary(cartItems);
        }
    } catch (error) {
        console.error("Error fetching cart", error);
    }
}

async function updateCartItem(id, quantity) {
    try {
        const response = await fetch(`/cart/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ quantity }),
        });
        if (!response.ok) throw new Error("Failed to update cart item");
        await fetchCartItems();
    } catch (error) {
        console.error("Error updating cart:", error);
    }
}


async function removeCartItem(id) {
    try {
        const response = await fetch(`/cart/${id}`, { method: "DELETE" });
        if (!response.ok) throw new Error("Failed to remove cart item");
        await fetchCartItems();
    } catch (error) {
        console.error("Error removing cart item:", error);
    }
}

// add product to cart
async function addToCart(productId, quantity) {
    if (!productId || quantity <= 0) {
        alert("Invalid product ID or quantity");
        return;
    }

    const cartData = { productId, quantity };

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

        // Refresh cart items
        await fetchCartItems();
    } catch (error) {
        console.error("Error adding to cart:", error);
        alert("Failed to add product");
    }
}

document.getElementById('cart-items').addEventListener('click', async (e) => {
    const cartItemsContainer = document.getElementById("cart-items");
    cartItemsContainer.innerHTML = "";
    const target = e.target;
    const id = target.dataset.id;

    if (target.classList.contains('update')) {
        const quantityInput = document.querySelector(`input[data-id="${id}"]`);
        const quantity = parseInt(quantityInput.value);
        updateCartItem(id, quantity);
    } else if (target.classList.contains('remove')) {
        removeCartItem(id);
    }
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