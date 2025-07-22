require('dotenv').config(); // Tải biến môi trường

const { GoogleGenerativeAI } = require('@google/generative-ai');
const { pool } = require('../models/product'); // Nhập pool từ product.js

// Cấu hình môi trường
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

/**
 * Gửi query đến cơ sở dữ liệu và phân tích bằng Gemini để xử lý ngôn ngữ tự nhiên.
 * @param {string} query - Câu hỏi từ người dùng.
 * @param {string} sessionId - ID của phiên chat.
 * @returns {Promise<string>} - Câu trả lời tự nhiên.
 */
async function sendMessage(query, sessionId) {
    if (!query) {
        return "Vui lòng gửi câu hỏi!";
    }

    try {
        if (!GEMINI_API_KEY) {
            throw new Error('Thiếu GEMINI_API_KEY trong .env');
        }

        // Truy vấn tất cả sản phẩm từ cơ sở dữ liệu
        const [products] = await pool.query('SELECT * FROM products');
        const productList = products.map(product => ({
            name: product.name,
            price: product.price,
        }));

        // Yêu cầu phản hồi ngắn gọn và rõ ràng
        const analysisQuery = `Phân tích "${query}" dựa trên sản phẩm VNPT Yên Bái. Dữ liệu: ${JSON.stringify(productList)}. Trả về câu trả lời ngắn gọn, chỉ bao gồm sản phẩm phù hợp, giá và lợi ích cơ bản. Nếu không tìm thấy, đề xuất hotline 0911261966.`;

        // Khởi tạo mô hình gemini-2.0-flash
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
        const result = await model.generateContent(analysisQuery);
        const natural_response = result.response.text();

        return natural_response || "Không tìm thấy. Gọi 0911261966!";
    } catch (error) {
        console.error('LỖI:', error);
        if (error.code === 'ER_ACCESS_DENIED_ERROR') {
            return 'Lỗi kết nối cơ sở dữ liệu.';
        }
        return 'Lỗi, thử lại sau!';
    }
}

// Xuất hàm sendMessage
module.exports = {
    sendMessage
};