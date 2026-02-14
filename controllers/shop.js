const path = require('path');
const rootDir = require('../util/path');
const Product = require('../models/product');
const Cart = require('../models/cart');

// Controller to get all products and render the shop homepage

exports.getProducts = (req, res, next) => {
  // Fetch all products from the file
  Product.fetchAll(products => {
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products'
    });
  });
};

// GET: Render the "Product Details" page for a specific item
exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  // Find the specific product by ID to show its details
  Product.findById(prodId, product => {
    if (!product) {
      return res.redirect('/'); // If product is missing, go back to Shop
    }
    res.render('shop/product-detail', {
      product: product,
      pageTitle: product.title,
      path: '/products'
    });
  });
};

// GET: Render the Shop Homepage
exports.getIndex = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/'
    });
  });
};

// GET: Render the Shopping Cart
exports.getCart = (req, res, next) => {
  // 1. Fetch the cart (which only has IDs and Qty)
  Cart.getCart(cart => {
    // 2. Fetch all products (to get Titles, Prices, Images)
    Product.fetchAll(products => {
      const cartProducts = [];
      // 3. Match Cart IDs with Product Details
      for (product of products) {
        const cartProductData = cart.products.find(
          prod => prod.id === product.id
        );
        // If the product exists in the cart, push it to our display array
        if (cartProductData) {
          cartProducts.push({ productData: product, qty: cartProductData.qty });
        }
      }
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: cartProducts
      });
    });
  });
};

// POST: Add an item to the cart
exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  // Find product to get its price, then add to cart
  Product.findById(prodId, product => {
    Cart.addProduct(prodId, product.price);
  });
  res.redirect('/cart');
};

// POST: Delete an item from the cart
exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  // Find product to get price
  Product.findById(prodId, product => {
    Cart.deleteProduct(prodId, product.price);
    res.redirect('/cart');
  });
};

// GET: Render the Orders page
exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders'
  });
};

// GET: Render the Checkout pag

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};