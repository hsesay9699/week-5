const fs = require('fs');
const path = require('path');

const Cart = require('./cart');

const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'products.json'
);

// Helper function: Reads the file and returns the array of products
const getProductsFromFile = cb => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb([]);
    } else {
      cb(JSON.parse(fileContent));
    }
  });
};

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }
  // Method to save a new product OR update an existing one
  save() {
    getProductsFromFile(products => {
      if (this.id) {
        // Editing an existing product
        const existingProductIndex = products.findIndex(
          prod => prod.id === this.id
        );
        const updatedProducts = [...products];
        updatedProducts[existingProductIndex] = this;
        fs.writeFile(p, JSON.stringify(updatedProducts), err => {
          console.log(err);
        });
      } else {
        // Adding a new product
        this.id = Math.random().toString();
        products.push(this);
        fs.writeFile(p, JSON.stringify(products), err => {
          console.log(err);
        });
      }
    });
  }

  // Method to delete a product by its ID
  static deleteById(id) {
    getProductsFromFile(products => {
      // Find the product first
      const product = products.find(prod => prod.id === id);
      // Keep every product EXCEPT the one we want to delete
      const updatedProducts = products.filter(prod => prod.id !== id);
      fs.writeFile(p, JSON.stringify(updatedProducts), err => {
        if (!err) {
          // If product deletion was successful, also remove it from the cart
          Cart.deleteProduct(id, product.price);
        }
      });
    });
  }
  // Method to retrieve all products
  static fetchAll(cb) {
    getProductsFromFile(cb);
  }

  // Method to find a single product by its ID
  static findById(id, cb) {
    getProductsFromFile(products => {
      const product = products.find(p => p.id === id);
      cb(product);
    });
  }
};