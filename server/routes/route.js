const express = require('express');
const controller = require('../controllers/controller');

const router = express.Router();

router.get('/products', controller.get_products);
router.get('/products/:product_id', controller.get_product_id);
router.get('/products/:product_id/styles', controller.get_product_styles);
router.get('/products/:product_id/related', controller.get_related_products);

module.exports = {
  router,
};
