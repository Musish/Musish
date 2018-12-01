const Dotenv = require('dotenv-webpack');
const Encore = require('@symfony/webpack-encore');
const HtmlWebpackPlugin = require('html-webpack-plugin');

Encore.setOutputPath('build/').
    setPublicPath('/').
    addEntry('app', './src/index.jsx').
    enableSingleRuntimeChunk().
    cleanupOutputBeforeBuild().
    enableSourceMaps(!Encore.isProduction())
    // enables hashed filenames (e.g. app.abc123.css)
    .enableVersioning(Encore.isProduction()).
    configureCssLoader(config => {
      config.modules = true;
      if (Encore.isProduction()) {
        config.localIdentName = '[sha1:hash:hex:4]';
      } else {
        config.localIdentName = '[name]__[local]--[sha1:hash:hex:4]';
      }
    }).
    enableReactPreset().
    enableSassLoader()
;

const config = Encore.getWebpackConfig();

config.module.rules.push({
  test: /\.(pdf)$/,
  loader: 'file-loader',
  options: {
    name: 'assets/cv/[name].[ext]',
  },
});

config.plugins.push(new HtmlWebpackPlugin({  // Also generate a test.html
  template: 'src/app.html',
  title: 'Apple Musish',
  meta: {
    viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no',
  },
}));

config.plugins.push(new Dotenv());

module.exports = config;
