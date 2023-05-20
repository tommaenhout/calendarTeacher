const path = require('path');

module.exports = {
  entry: './js/main.js',
  resolve: {
    extensions: ['.js'],
    alias: {
      // Add any relevant alias configurations here
    },
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  mode : 'production',
};
