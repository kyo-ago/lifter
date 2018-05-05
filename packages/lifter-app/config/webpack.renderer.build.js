const webpackConf = require("electron-webpack/webpack.renderer.config.js");
const webpackMerge = require("webpack-merge");
const testConfig = require("../test/webpack.config");

module.exports = async env => {
    let conf = await webpackConf(env);
    delete testConfig.externals;
    conf.module.rules = conf.module.rules.filter(rule => !(rule.test.test(".vue") || rule.test.test(".ts")));
    let resultConfig = webpackMerge.smart(conf, testConfig);
    resultConfig.module.rules.filter(rule => rule.test.test(".ts")).forEach(rule => {
        rule.exclude = /node_modules|\.(mock|spec)\.tsx?$/;
    });
    return resultConfig;
};
