import * as webpack from 'webpack';
import path from 'path';
import nodeExternals from 'webpack-node-externals';
import WebpackHookPlugin from 'webpack-hook-plugin';

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

const config: webpack.Configuration = {
  mode: IS_PRODUCTION ? 'production' : 'development',
  target: 'node',
  devtool: IS_PRODUCTION ? 'source-map' : 'eval-cheap-module-source-map',

  externals: [nodeExternals()],
  node: {
    __dirname: false,
    __filename: false,
  },
  resolve: {
    modules: ['node_modules'],
    extensions: ['.js', '.json', '.ts'],
  },
  entry: {
    chartRenderer: path.join(__dirname, 'src/index.ts'),
  },

  module: {
    parser: {
      javascript: {
        // Enable magic comments, disable by default for perf reasons
        commonjsMagicComments: true,
      },
    },
    rules: [
      {
        test: /\.[tj]sx?$/,
        exclude: /(vendor|dist)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/env', '@babel/preset-typescript'],
            plugins: ['@babel/plugin-transform-runtime'],
          },
        },
      },
      {
        test: /\.(woff|woff2|ttf|eot|svg|png|gif|ico|jpg|mp4)($|\?)/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[hash:6].[ext]',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.BannerPlugin({banner: '#!/usr/bin/env node', raw: true}),
    new WebpackHookPlugin({onBuildEnd: ['chmod +x lib/chartRenderer.js']}),
  ],
  output: {
    path: path.join(__dirname, 'lib'),
  },
};

export default config;
