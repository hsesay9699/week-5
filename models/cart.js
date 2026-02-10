const fs = require('fs');
const path = require('path');
const rootDir = require('../util/path');

// Path to the cart.json data file
const p = path.join(rootDir, 'data', 'cart.json');

module.exports = class Cart {
  // Method to add a new product to the cart
  static addProduct(id, productPrice) {
    // 1. Fetch the previous cart
    fs.readFile(p, (err, fileContent) => {
      let cart = { products: [], totalPrice: 0 };
      if (!err) {
        // If file exists, parse the existing cart
        cart = JSON.parse(fileContent);
      }

      // 2. Analyze the cart => Find existing product
      const existingProductIndex = cart.products.findIndex(
        prod => prod.id === id
      );
      const existingProduct = cart.products[existingProductIndex];
      let updatedProduct;

      // 3. Add new product or increase quantity
      if (existingProduct) {
        updatedProduct = { ...existingProduct };
        updatedProduct.qty = updatedProduct.qty + 1;
        cart.products = [...cart.products];
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        updatedProduct = { id: id, qty: 1 };
        cart.products = [...cart.products, updatedProduct];
      }

      // 4. Update the total price of the cart
      // The '+' before productPrice ensures it's treated as a number
      cart.totalPrice = cart.totalPrice + +productPrice;

      // 5. Save the updated cart back to the file
      fs.writeFile(p, JSON.stringify(cart), err => {
        console.log(err);
      });
    });
  }
};