const Encore = require('@symfony/webpack-encore');

Encore
    .setOutputPath('public/')
    .setPublicPath('/bundles/contaotabs')
    .setManifestKeyPrefix('')
    .cleanupOutputBeforeBuild()
    .disableSingleRuntimeChunk()
    .enableSourceMaps(!Encore.isProduction())
    .enableVersioning(Encore.isProduction())
    .addEntry('tabs', './assets/js/tabs.js')
	.enablePostCssLoader()
;

const config = Encore.getWebpackConfig();
config.watchOptions = {
	poll: 150
};

module.exports = [config];