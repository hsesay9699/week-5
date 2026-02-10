const path = require('path');
const rootDir = require('../util/path');
const Product = require('../models/product');
const Cart = require('../models/cart');

// Controller to get all products and render the shop homepage
exports.getProducts = (req, res, next) => {
  Product.fetchAll(products => {
    res.sendFile(path.join(rootDir, 'views', 'shop.html'));
  });
};

// Controller to get the cart page
exports.getCart = (req, res, next) => {
  // Serves the cart page (we will use shop.html as placeholder if cart.html missing)
  res.sendFile(path.join(rootDir, 'views', 'shop.html'));
};

// Controller to handle adding a product to the cart
exports.postCart = (req, res, next) => {
  // Get the product ID from the request
  const prodId = req.body.productId;
  
  // Find the product by ID to get its price
  Product.findById(prodId, product => {
    // Add the product to the Cart model
    Cart.addProduct(prodId, product.price);
  });
  
  // Redirect the user to the cart page
  res.redirect('/cart');
};

// Controller to get the checkout page
exports.getCheckout = (req, res, next) => {
  res.sendFile(path.join(rootDir, 'views', 'shop.html'));
};