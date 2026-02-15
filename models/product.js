const db = require('../util/database');

const Cart = require('./cart');

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    // We use ? as placeholders to prevent SQL Injection
    // The second argument is the array of values to inject
    return db.execute(
      'INSERT INTO products (title, price, imageUrl, description) VALUES (?, ?, ?, ?)',
      [this.title, this.price, this.imageUrl, this.description]
    );
  }

  static deleteById(id) {
    // Simple SQL delete command
    return db.execute('DELETE FROM products WHERE products.id = ?', [id]);
  }

  static fetchAll() {
    // Returns a Promise that resolves with [rows, fieldData]
    return db.execute('SELECT * FROM products');
  }

  static findById(id) {
    // Fetch a single product
    return db.execute('SELECT * FROM products WHERE products.id = ?', [id]);
  }
};