const path = require('path');

module.exports = {
  entry: {
    main: './src/ts/main.ts',
    newsletter: './src/newsletter.js',
    blog: './src/blog.js',
    'discount-popup': './src/discount-popup.js',
    jobApplicationForm: {
      import: './src/ts/components/JobApplicationForm.ts',
      filename: 'components/[name].js'
    },
    'utils/markdown-to-blog': {
      import: './src/ts/utils/markdown-to-blog.ts',
      filename: 'utils/[name].js'
    }
  },
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
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    library: {
      type: 'commonjs2'
    }
  },
  target: 'node',
  mode: 'production',
  externals: {
    'fs': 'commonjs2 fs',
    'path': 'commonjs2 path'
  }
}; 