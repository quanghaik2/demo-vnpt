const express = require('express');
const path = require('path');
const cors = require('cors');
const dialogflowService = require('./services/dialogflow.service');
require('dotenv').config();
const productRouter = require('./router/productRouter');

const app = express();
const PORT = process.env.PORT || 3000;

// --- MIDDLEWARE ---
app.use(cors()); 
app.use(express.json()); 
app.use(express.static(path.join(__dirname, 'public'))); // Phục vụ file tĩnh từ public
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// --- ROUTES ---
app.use('/', productRouter);
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/tu-van', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'tu-van.html'));
});
app.get('/lien-he', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'lien-he.html'));
});
app.get('/gioi-thieu', (req, res) =>
    res.sendFile(path.join(__dirname, 'views', 'gioi-thieu.html'))
);
app.get('/tin-tuc', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'tin-tuc.html'));
});

app.post('/send-message', async (req, res) => {
    const { message, sessionId } = req.body;

    if (!message || !sessionId) {
        return res.status(400).json({ error: 'Thiếu message hoặc sessionId' });
    }

    try {
        const reply = await dialogflowService.sendMessage(message, sessionId);
        res.json({ reply: reply });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    app.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});

app.listen(PORT, () => {
    console.log(`Server đang chạy trên cổng ${PORT} theo mô hình MVC`);
    console.log(`Truy cập http://localhost:${PORT}`);
});