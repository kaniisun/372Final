// fetch orders 
document.addEventListener("DOMContentLoaded", () => {
    fetchOrderHistory();

    async function fetchOrderHistory() {
        try {
            const response = await fetch('/orders');
            const orders = await response.json();
            const ordersContainer = document.querySelector('.orders');
            ordersContainer.innerHTML = '';

            orders.forEach(order => {
                const orderHTML = `
                    <div class="order">
                        <h3>Order #${order.id}</h3>
                        <p>Date: ${order.date}</p>
                        <p>Status: ${order.status}</p>
                        <ul>
                            ${order.items.map(item => `
                                <li>${item.product_name} (x${item.quantity}) - $${item.price}</li>
                            `).join('')}
                        </ul>
                        <p>Total: $${order.totalPrice}</p>
                    </div>
                `;
                ordersContainer.innerHTML += orderHTML;
            });
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    }
});