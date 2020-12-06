const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema is an empty object: only making GET requests for this backend service
let productSchema = new Schema({}, { collection: 'product' });
let Product = mongoose.model('Product', productSchema);

module.exports = {
  Product,
};
