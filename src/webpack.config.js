const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const dirCwd = process.cwd();
let plugins = [];

module.exports = (opts = {}) => {
  const pkg = require(`${dirCwd}/package.json`);
  const { args } = opts;
  const name = pkg.name;
  const isProd = opts.production;

  if (isProd) {
    plugins = [
      new webpack.BannerPlugin(`${name} - ${pkg.version}`),
    ]
  } else {
    const index = `${dirCwd}/index.html`;
    const indexDev = `${dirCwd}/_index.html`;
    plugins.push(new HtmlWebpackPlugin({
      template: fs.existsSync(indexDev) ? indexDev : index,
    }));
  }

  return {
    entry: path.resolve(dirCwd, args.entry),
    mode: isProd ? 'production' : 'development',
    devtool: isProd ? 'source-map' : 'cheap-module-eval-source-map',
    output: {
        path: path.resolve(dirCwd, args.output),
        filename: `${name}.min.js`,
        library: name,
        libraryTarget: 'umd',
    },
    module: {
      rules: [{
          test: /\.js$/,
          loader: 'babel-loader',
          include: /src/,
          options: {
            presets: [
              [ require('@babel/preset-env'), {
                targets: '> 0.25%, not dead',
                useBuiltIns: 'usage',
                corejs: 3,
              } ]
            ],
            plugins: [ require('@babel/plugin-transform-runtime') ],
            cacheDirectory: true,
            ...args.babel,
          },
      }],
    },
    plugins: plugins,
  };
}