// fetch items and display
async function fetchCartItems() {
    try {
        const response = await fetch('http://localhost:3000/cart');
        if (!response.ok) throw new Error("Failed to fetch cart items");

        const cartItems = await response.json();

        const cartItemsContainer = document.getElementById("cart-items");

        if (cartItems.length === 0) {
            cartItemsContainer.innerHTML = `<tr><td colspan="5">Your cart is empty</td></tr>`;
        } else {
            cartItemsContainer.innerHTML = "";
            cartItems.forEach(item => {
                const totalPrice = (item.price * item.quantity).toFixed(2);
                cartItemsContainer.innerHTML += `
                    <tr>
                        <td>
                            <div class="cart-item">
                                <img src="/images/${item.name.toLowerCase().replace(/\s/g, '')}.png" alt="${item.name}">
                                <span>${item.name}</span>
                            </div>
                        </td>
                        <td>$${item.price.toFixed(2)}</td>
                        <td>
                            <input type="number" class="quantity" value="${item.quantity}" min="1" data-id="${item.id}">
                            <button class="btn update" data-id="${item.id}">Update</button>
                        </td>
                        <td>$${totalPrice}</td>
                        <td>
                            <button class="btn remove" data-id="${item.id}">Remove</button>
                            <button class="save">Save for Later</button>
                        </td>
                    </tr>
                `;
            });
            calculateCartSummary(cartItems);
        }
        addEventListeners();
    } catch (error) {
        console.error("Error fetching cart", error);
    }
}

// event listener for update and remove button
function addEventListeners() {
    document.querySelectorAll(".update").forEach(button => {
        button.addEventListener("click", async (e) => {
            const id = e.target.dataset.id;
            const quantityInput = document.querySelector(`input[data-id="${id}"]`);
            const quantity = parseInt(quantityInput.value);

            try {
                const response = await fetch(`/cart/${id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ quantity })
                });
                if (!response.ok) throw new Error("Failed to update cart item");

                fetchCartItems();
            } catch (error) {
                console.error("Error updating", error);
            }
        });
    });

    document.querySelectorAll(".remove").forEach(button => {
        button.addEventListener("click", async (e) => {
            const id = e.target.dataset.id;

            try {
                const response = await fetch(`/cart/${id}`, { method: "DELETE" });
                if (!response.ok) throw new Error("Failed to remove cart item");

                fetchCartItems();
            } catch (error) {
                console.error("Error removing", error);
            }
        });
    });
}

// add product to cart
async function addToCart(productId, quantity) {
    const quantity = document.getElementById('quantity').value;
    try {
        const response = await fetch('/cart', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(cartData)
        });

        if (!response.ok) {
            const errorDetails = await response.json();
            alert("Failed to add product" + errorDetails.message);
            return;
        }

        const result = await response.json();
        alert("Product added to cart");
        window.location.href = "/cart.html";
    } catch (error) {
        alert("Failed to add product to cart");
    }
}

// calculate cart total
function calculateCartSummary(cartItems) {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.0675;
    const deliveryFee = 10.00;
    const total = subtotal + tax + deliveryFee;

    document.querySelector(".summary").innerHTML = `
        <p>Subtotal: $${subtotal.toFixed(2)}</p>
        <p>Tax (6.75%): $${tax.toFixed(2)}</p>
        <p>Delivery Fee: $${deliveryFee.toFixed(2)}</p>
        <p class="total">Total: $${total.toFixed(2)}</p>
    `;
}

document.addEventListener("DOMContentLoaded", async () => {
    await fetchCartItems();
});

document.addEventListener("DOMContentLoaded", async () => {
    await fetchCartItems();
});