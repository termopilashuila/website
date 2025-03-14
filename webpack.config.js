const path = require('path');
const fs = require('fs');

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
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  mode: 'production',
  plugins: [
    {
      apply: (compiler) => {
        compiler.hooks.afterEmit.tap('CopyServiceWorker', (compilation) => {
          const srcPath = path.resolve(__dirname, 'src/js/service-worker.js');
          const destPath = path.resolve(__dirname, 'dist/service-worker.js');
          fs.copyFileSync(srcPath, destPath);
          console.log('Service worker copied to dist directory');
        });
      }
    }
  ]
}; 