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
        addToCartButton.dataset.id = product.product_id;

        addToCartButton.addEventListener('click', () => {
            const quantity = parseInt(document.getElementById('quantity').value);
            addToCart(product.product_id, quantity);
        });
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

// add to cart 
async function addToCart(productId, quantity) {
    if (!productId || quantity <= 0) {
        alert("Invalid product ID or quantity");
        return;
    }

    const cartData = { productId, quantity };

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
            alert("Failed to add product");
            return;
        }

        const result = await response.json();
        alert("Product added");

        window.location.href = "/cart.html";
    } catch (error) {
        alert("Failed to add product");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const productId = new URLSearchParams(window.location.search).get("id");
    if (productId) {
        fetchProductDetails(productId);
        fetchSimilarProducts();
    } else {
        fetchAllProducts();
    }
});