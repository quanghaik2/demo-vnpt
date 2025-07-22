const fs = require('fs').promises;
const path = require('path');

const productSchema = {
    name: { type: 'VARCHAR(255)', required: true },
    description: { type: 'TEXT', required: true },
    price: { type: 'DECIMAL(10,2)', required: true },
    category: { type: 'VARCHAR(100)', default: 'general' }
};

async function loadProducts() {
    try {
        const data = await fs.readFile(path.join(__dirname, 'products.json'), 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error loading products:', error);
        return [];
    }
}

module.exports = {
    getAllProducts: async () => {
        return await loadProducts();
    },
    getProductById: async (id) => {
        const products = await loadProducts();
        return products.find(product => product.id === parseInt(id));
    }
};