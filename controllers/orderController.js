const orders = [
    {
        id: 1,
        date: '2024-12-01',
        status: 'Delivered',
        items: [
            { product_name: 'Bouquet 1', quantity: 2, price: 17.99 }
        ],
        totalPrice: 35.98
    },
    {
        id: 2,
        date: '2024-12-05',
        status: 'Pending',
        items: [
            { product_name: 'Bouquet 2', quantity: 1, price: 18.99 }
        ],
        totalPrice: 18.99
    }
];

const getOrders = (req, res) => {
    res.json(orders);
};

module.exports = {
    getOrders
};