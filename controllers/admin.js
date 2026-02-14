const path = require('path');
const rootDir = require('../util/path');
const Product = require('../models/product');

// Controller to render the Add Product page

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,  // Signals that we are in "Add" mode, not "Edit"
    activeAddProduct: true
  });
};

// POST: Handle the submission of a new product
exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  // Create a new product instance
  const product = new Product(null, title, imageUrl, description, price);
  product.save();
  // Redirect back to the shop homepage
  res.redirect('/');
};

// GET: Render the "Edit Product" page for a specific product
exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  // Fetch the product details to pre-fill the form
  Product.findById(prodId, product => {
    // If no product found, redirect
    if (!product) {
      return res.redirect('/');
    }
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode, // Signals "Edit" mode to the view
      product: product
    });
  });
};

// POST: Handle the submission of the edited product details
exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
  // Create a new product instance with the EXISTING ID 
  // This tells the model to update the existing entry
  const updatedProduct = new Product(
    prodId,
    updatedTitle,
    updatedImageUrl,
    updatedDesc,
    updatedPrice
  );
  updatedProduct.save();
  res.redirect('/admin/products');
};

// GET: Fetch and display all products for the Admin management page
exports.getProducts = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  });
};

// POST: Handle deleting a product
exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.deleteById(prodId);
  res.redirect('/admin/products');
};