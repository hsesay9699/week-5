const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

// Import the error controller
const errorController = require('./controllers/error');

const app = express();

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

// Use the error controller to handle 404 requests
app.use(errorController.get404);

app.listen(3000);