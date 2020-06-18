const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use:
         [ 'style-loader',
          {
            loader: 'css-loader',
            options:
              {
                importLoaders: 1,
                modules: true
              }
          }
        ]
      },
      { test: /\.jpg$/, use: 'file-loader' },
      { test: /\.png$/, use: 'file-loader' }
    ],
  },
};

