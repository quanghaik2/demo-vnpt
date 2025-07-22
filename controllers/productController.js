const { getAllProducts, getProductById } = require('../models/product');

exports.getAllProducts = async (req, res) => {
    try {
        const products = await getAllProducts();
        const itemsPerPage = 6;
        const currentPage = parseInt(req.query.page) > 0 ? parseInt(req.query.page) : 1;
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedProducts = products.slice(startIndex, endIndex);
        const totalPages = Math.ceil(products.length / itemsPerPage);

        res.render('products', { 
            products: paginatedProducts, 
            title: 'Tất cả sản phẩm',
            currentPage: currentPage,
            totalPages: totalPages
        });
    } catch (error) {
        console.error('Lỗi khi tải sản phẩm:', error);
        res.status(500).send('Lỗi khi tải sản phẩm: ' + error.message);
    }
};

exports.getProductById = async (req, res) => {
    try {
        const product = await getProductById(req.params.id);
        if (!product) return res.status(404).send('Sản phẩm không tìm thấy');
        res.render('product-detail', { 
            product: product, 
            title: product.name 
        }); // Cần tạo product-detail.ejs nếu muốn
    } catch (error) {
        console.error('Lỗi khi tải sản phẩm:', error);
        res.status(500).send('Lỗi khi tải sản phẩm: ' + error.message);
    }
};