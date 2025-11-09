const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/core/game.js',
  output: {
    filename: 'bundle.[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        type: 'asset/resource',
        generator: {
          filename: 'assets/images/[name].[hash][ext]'
        }
      },
      {
        test: /\.(mp3|ogg|wav)$/,
        type: 'asset/resource',
        generator: {
          filename: 'assets/sounds/[name].[hash][ext]'
        }
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        type: 'asset/resource',
        generator: {
          filename: 'assets/fonts/[name].[hash][ext]'
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
      title: 'PIROTS 5 - The Ultimate Treasure Hunt',
      meta: {
        viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no'
      }
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'assets', to: 'assets', noErrorOnMissing: true }
      ]
    })
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist')
    },
    compress: true,
    port: 8080,
    hot: true,
    open: true
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@assets': path.resolve(__dirname, 'assets'),
      '@config': path.resolve(__dirname, 'config')
    }
  }
};
