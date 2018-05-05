const webpackConf = require("electron-webpack/webpack.renderer.config.js");

module.exports = async env => {
    let conf = await webpackConf(env);
    conf.module.rules.filter(rule => rule.test.test(".vue")).forEach(rule => {
        Object.assign(rule.use.options.loaders, {
            i18n: "@kazupon/vue-i18n-loader",
            ts: {
                loader: "ts-loader",
                options: {
                    appendTsSuffixTo: [ "/\\.vue$/" ],
                    happyPackMode: true
                },
            },
        });
    });
    conf.module.rules.filter(rule => rule.test.test(".ts")).forEach(rule => {
        rule.exclude = /node_modules|\.(mock|spec)\.tsx?$/;
    });
    return conf;
};
