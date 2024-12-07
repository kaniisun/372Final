const API_URL = "http://localhost:3000/admin/products";

// fetch products
async function fetchProducts() {
    try {
        const response = await fetch(API_URL);
        const products = await response.json();
        displayProducts(products);
    } catch (error) {
        console.error("Error fetching:", error);
    }
}

window.addEventListener("DOMContentLoaded", () => {
    fetchProducts();
});

// display products in table
async function displayProducts(products) {
    const tbody = document.querySelector(".product-table tbody");
    tbody.innerHTML = "";

    products.forEach(product => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td><img src="${product.image}" alt="${product.name}" /></td>
            <td>${product.product_id}</td>
            <td>${product.product_name}</td>
            <td>${product.category}</td>
            <td>${product.price}</td>
            <td>${product.description}</td>
            <td>
                <button onclick="editProduct(${product.product_id})">Edit</button>
                <button onclick="deleteProduct(${product.product_id})">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// delete product by id
async function deleteProduct(productId) {
    try {
        const response = await fetch(`${API_URL}/${productId}`, { method: "DELETE" });

        if (response.ok) {
            fetchProducts();
        } else {
            alert("Failed to delete.");
        }
    } catch (error) {
        console.error("Error deleting:", error);
    }
}

// add new product
document.getElementById('add-product-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const imageFile = formData.get('image');
    const imageUrl = await uploadImage(imageFile);

    const productData = {
        name: formData.get("product_name"),
        category_id: parseInt(formData.get('category_id')),
        description: formData.get("description"),
        price: parseFloat(formData.get("price")),
        url: imageUrl,
    };

    const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
    });

    if (response.ok) {
        const newProduct = await response.json();
        fetchProducts();
        event.target.reset();
    } else {
        console.error("Failed to add product");
    }
});

// fetch a product
async function fetchProductData(productId) {
    try {
        const response = await fetch(`${API_URL}/${productId}`);
        const product = await response.json();

        document.querySelector("#product_id").value = product.product_id;
        document.querySelector("#product_name").value = product.product_name;
        document.querySelector("#category").value = product.category;
        document.querySelector("#price").value = product.price;
        document.querySelector("#description").value = product.description;
        document.querySelector("#image").value = product.image || '';
    } catch (error) {
        console.error("Error fetching:", error);
    }
}

window.onload = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id");

    if (productId) {
        const response = await fetch(`/admin/products/${productId}`);
        const product = await response.json();

        if (product) {
            document.getElementById('product_name').value = product.product_name;
            document.getElementById('category').value = product.category;
            document.getElementById('price').value = product.price;
            document.getElementById('description').value = product.description;
            document.getElementById('image').value = product.image;
            document.getElementById('product_id').value = product.product_id;
        }
    }
};

// edit product
document.getElementById('edit-product-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const productId = document.getElementById('product_id').value;
    const updatedProductData = {
        product_name: document.getElementById('product_name').value,
        category: document.getElementById('category').value,
        price: document.getElementById('price').value,
        description: document.getElementById('description').value,
        image: document.getElementById('image').value
    };

    const response = await fetch(`/admin/products/${productId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedProductData)
    });

    const result = await response.json();

    if (response.ok) {
        alert('Product updated ');
        window.location.href = '/admin/products';
    } else {
        alert('Error updating product: ' + result.message);
    }
});

function editProduct(productId) {
    window.location.href = `product-edit.html?id=${productId}`;
}

// attempt at bulk upload
document.getElementById('bulk-upload-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const fileInput = document.getElementById('file-upload');
    const file = fileInput.files[0];

    if (!file) {
        alert("Select a JSON file");
        return;
    }

    try {
        const fileContent = await file.text();
        const productsData = JSON.parse(fileContent);

        if (Array.isArray(productsData)) {
            const response = await fetch("http://localhost:3000/admin/products/bulk-upload", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productsData),
            });

            if (response.ok) {
                const result = await response.json();
                alert(result.message);
            } else {
                alert("Failed to upload");
            }
        } else {
            alert("Invalid JSON format");
        }
    } catch (error) {
        alert("Failed to upload");
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id");

    if (productId) {
        fetchProductData(productId);
    } else {
        console.error("No product ID");
    }
});

async function uploadImage(imageFile) {
    const formData = new FormData();
    formData.append('image', imageFile);

    try {
        const response = await fetch(`${API_URL}/upload`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Failed to upload image');
        }

        const result = await response.json();
        return result.imageUrl;
    } catch (error) {
        return null;
    }
}
