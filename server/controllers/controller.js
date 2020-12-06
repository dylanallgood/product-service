const { Product } = require('../models/model');

//****************PRODUCTS****************//
const get_products = (req, res) => {
  let count = parseInt(req.query.count) || 5;
  // page?
  let page = parseInt(req.body.page) || 1;

  // set limit on number of products per request
  count > 50 ? (count = 50) : (count = req.query.count);

  Product.find({}, { _id: 0, features: 0, styles: 0, related: 0 })
    .limit(count)
    .lean()
    .then((products) => {
      res.status(200).send(products);
    })
    .catch((err) => console.log(err));
};

//****************PRODUCT BY ID****************//
const get_product_id = (req, res) => {
  let id = parseInt(req.query.product_id);

  Product.find({ product_id: id }, { _id: 0 })
    .lean()
    .then((product) => {
      res.status(200).send(product[0]);
    })
    .catch((err) => console.log(err));
};

//****************STYLES****************//
const get_product_styles = (req, res) => {
  let id = parseInt(req.query.product_id);

  Product.find({ product_id: id }, { _id: 0 })
    .select('styles')
    .lean()
    .then((styles) => {
      res.status(200).send(styles);
    })
    .catch((err) => console.log(err));
};

//****************RELATED PRODUCTS****************//
const get_related_products = (req, res) => {
  let id = parseInt(req.query.product_id);

  Product.find({ product_id: id }, { _id: 0 })
    .select('related')
    .lean()
    .then((related) => {
      res.status(200).send(related);
    })
    .catch((err) => console.log(err));
};

module.exports = {
  get_products,
  get_product_id,
  get_product_styles,
  get_related_products,
};
