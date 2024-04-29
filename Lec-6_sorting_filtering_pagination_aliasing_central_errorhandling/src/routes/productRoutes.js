const express = require('express');

const {
    createProduct,
    getProducts,
    getProductById,
    // updateProduct,
    // deleteProduct,
    getProductHandler,
    getTop5Products
}  = require('../controllers/productController');

const router = express.Router();

router.post('/', createProduct);
// router.get('/', getTop5Products, getProductHandler);
router.get('/bigBillionDay', getProductHandler);
router.get('/', getProducts);
router.get('/:id', getProductById);
// router.put('/:id', updateProduct);
// router.delete('/:id', deleteProduct);



module.exports = router;