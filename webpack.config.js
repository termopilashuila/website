const path = require('path');

module.exports = {
  entry: {
    main: './src/ts/main.ts',
    jobApplicationForm: {
      import: './src/ts/components/JobApplicationForm.ts',
      filename: 'components/[name].js'
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
      type: 'module'
    }
  },
  experiments: {
    outputModule: true
  },
  mode: 'production'
}; 