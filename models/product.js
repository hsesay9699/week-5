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
    // If an ID exists, we UPDATE the existing product
    if (this.id) {
      return db.execute(
        'UPDATE products SET title = ?, price = ?, imageUrl = ?, description = ? WHERE id = ?',
        [this.title, this.price, this.imageUrl, this.description, this.id]
      );
    } else {
      // If no ID, we INSERT a new product
      return db.execute(
        'INSERT INTO products (title, price, imageUrl, description) VALUES (?, ?, ?, ?)',
        [this.title, this.price, this.imageUrl, this.description]
      );
    }
  }

  static deleteById(id) {
    // 1. First, fetch the product so we can get its price (needed for the Cart)
    return db.execute('SELECT * FROM products WHERE id = ?', [id])
      .then(([rows]) => {
        const product = rows[0];
        
        // 2. Now, delete the product from the MySQL Database
        return db.execute('DELETE FROM products WHERE id = ?', [id])
          .then(() => {
            // 3. Finally, remove it from the JSON File System Cart!
            if (product) {
              Cart.deleteProduct(id, product.price);
            }
          });
      })
      .catch(err => console.log(err));
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