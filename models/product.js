const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'vnpt_db'
});

const productSchema = {
    name: { type: 'VARCHAR(255)', required: true },
    description: { type: 'TEXT', required: true },
    price: { type: 'DECIMAL(10,2)', required: true },
    category: { type: 'VARCHAR(100)', default: 'general' }
};

module.exports = {
    pool,
    getAllProducts: async () => {
        const [rows] = await pool.query('SELECT * FROM products');
        return rows;
    },
    getProductById: async (id) => {
        const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
        return rows[0];
    }
};