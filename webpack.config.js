const path = require('path');

module.exports = {
  entry: './src/ts/main.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      '@components': path.resolve(__dirname, 'src/ts/components'),
      '@utils': path.resolve(__dirname, 'src/ts/utils'),
      '@types': path.resolve(__dirname, 'src/ts/types'),
      '@': path.resolve(__dirname, 'src/ts')
    }
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  mode: 'production'
}; 