const path = require('path');
const rootDir = require('../util/path');

// Controller for handling 404 Page Not Found errors
exports.get404 = (req, res, next) => {
  res.status(404).render('404', { 
    pageTitle: 'Page Not Found', 
    path: '/404'
  });
};