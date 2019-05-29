/* tslint:disable */

const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');
const Encore = require('@symfony/webpack-encore');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

Encore.setOutputPath('build/')
  .setPublicPath('/')
  .addEntry('app', './src/app/index.jsx')
  .enableSingleRuntimeChunk()
  .cleanupOutputBeforeBuild()
  .enableSourceMaps(true)
  // enables hashed filenames (e.g. app.abc123.css)
  .enableVersioning(Encore.isProduction())
  .configureCssLoader(config => {
    config.modules = true;
    if (Encore.isProduction()) {
      config.localIdentName = '[sha1:hash:hex:4]';
    } else {
      config.localIdentName = '[name]__[local]--[sha1:hash:hex:4]';
    }
  })
  .enableTypeScriptLoader()
  .enableReactPreset()
  .enableSassLoader();

const config = Encore.getWebpackConfig();

config.plugins.push(
  new HtmlWebpackPlugin({
    // Also generate a test.html
    template: 'src/app/app.html',
    title: 'Musish',
    meta: {
      viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no',
    },
    env: process.env,
  }),
);

config.plugins.push(new Dotenv());

if (!Encore.isProduction()) {
  config.devServer.historyApiFallback = {
    disableDotRule: true,
  };
}

config.plugins.push(new FaviconsWebpackPlugin({
  // Your source logo
  logo: `${__dirname}/src/app/assets/images/musish-favicon.svg`,
  // The prefix for all image files (might be a folder or a name)
  prefix: 'icons-[hash]/',
  // Emit all stats of the generated icons
  emitStats: false,
  // The name of the json containing all favicon information
  statsFilename: 'iconstats-[hash].json',
  // Generate a cache file with control hashes and
  // don't rebuild the favicons until those hashes change
  persistentCache: true,
  // Inject the html into the html-webpack-plugin
  inject: true,
  // favicon background color (see https://github.com/haydenbleasel/favicons#usage)
  background: 'transparent',
  // favicon app title (see https://github.com/haydenbleasel/favicons#usage)
  title: 'Musish',

  // which icons should be generated (see https://github.com/haydenbleasel/favicons#usage)
  icons: {
    android: true,
    appleIcon: true,
    appleStartup: true,
    coast: false,
    favicons: true,
    firefox: true,
    opengraph: false,
    twitter: false,
    yandex: false,
    windows: false
  }
}));

config.plugins.push(
  new webpack.WatchIgnorePlugin([
    /scss\.d\.ts$/
  ]),
);

module.exports = config;
