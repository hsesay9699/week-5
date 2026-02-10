const path = require('path');
const rootDir = require('../util/path');
const Product = require('../models/product');

// Controller to render the Add Product page
exports.getAddProduct = (req, res, next) => {
  // Serves the add-product.html view
  res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
};

// Controller to handle the submission of a new product
exports.postAddProduct = (req, res, next) => {
  // Extract data from the request body
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  
  // Create a new product instance with the extracted data
  // (id is null because it's a new product)
  const product = new Product(null, title, imageUrl, description, price);
  
  // Save the product to the file system
  product.save();
  
  // Redirect to the homepage
  res.redirect('/');
};

// Controller to get all products for the admin view
exports.getProducts = (req, res, next) => {
  Product.fetchAll(products => {
    // Ideally renders an admin-specific product list
    res.sendFile(path.join(rootDir, 'views', 'shop.html'));
  });
};