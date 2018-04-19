const webpackConf = require('electron-webpack/webpack.renderer.config.js');

module.exports = async (env) => {
    let conf = await webpackConf(env);
    conf.module.rules.filter((rule) => rule.test.test('.vue')).forEach((rule) => {
        rule.use.options.loaders.i18n = "@kazupon/vue-i18n-loader";
    });
    conf.module.rules.filter((rule) => rule.test.test('.ts')).forEach((rule) => {
        rule.exclude = /node_modules|\.(mock|spec)\.tsx?$/
    });
    return conf;
};
