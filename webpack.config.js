const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/index.ts',
  output: {
    filename: 'autonome.js',
    path: path.resolve(__dirname, 'build'),
  },
  resolve: {
    extensions: [ '.ts', '.js', '.d.ts' ],
  },
  target: "node",
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
};
