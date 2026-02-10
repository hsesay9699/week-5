const path = require('path');
const rootDir = require('../util/path');

// Controller for handling 404 Page Not Found errors
exports.get404 = (req, res, next) => {
  // Serves the 404.html view
  res.status(404).sendFile(path.join(rootDir, 'views', '404.html'));
};