const { Product } = require('../models/model');
const { promisify } = require('util');
const redis = require('redis');
const redisClient = redis.createClient(6379);
const getPromise = promisify(redisClient.get).bind(redisClient);

//****************REDIS CONNECT****************//
// redisClient.on('connect', () => {
//   console.log('Connected to Redis');
// });

//****************PRODUCTS****************//
const get_products = (req, res) => {
  let count = parseInt(req.params.count) || 5;
  // page?
  let page = parseInt(req.params.page) || 1;

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
  let id = parseInt(req.params.product_id);

  //checks redis cache
  getPromise(id)
    .then((data) => {
      if (data !== null) {
        let result = JSON.parse(data);
        res.json(result);
      } else {
        next();
      }
    })
    .catch((err) => console.log(err));

  Product.findOne({ product_id: id }, { _id: 0 })
    .lean()
    .then((product) => {
      // store product in redis
      let result = JSON.stringify(product);
      redisClient.set(id, result);
      res.status(200).send(product);
    })
    .catch((err) => console.log(err));
};

//****************STYLES****************//
const get_product_styles = (req, res, next) => {
  let id = parseInt(req.params.product_id);

  // checks redis cache
  getPromise(id)
    .then((data) => {
      if (data !== null) {
        let result = JSON.parse(data);
        res.json(result.styles);
      } else {
        next();
      }
    })
    .catch((err) => console.log(err));
};

//****************RELATED PRODUCTS****************//
const get_related_products = (req, res) => {
  let id = parseInt(req.params.product_id);

  // checks redis cache
  getPromise(id)
    .then((data) => {
      if (data !== null) {
        let result = JSON.parse(data);
        res.json(result.related);
      } else {
        next();
      }
    })
    .catch((err) => console.log(err));
};

module.exports = {
  get_products,
  get_product_id,
  get_product_styles,
  get_related_products,
};
