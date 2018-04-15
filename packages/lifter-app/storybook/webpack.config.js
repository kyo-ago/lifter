let path = require("path");
let testConfig = require("../test/webpack.config");

module.exports = (storybookBaseConfig) => {
    storybookBaseConfig.module.rules = storybookBaseConfig.module.rules.map((rule) => {
        return testConfig.module.rules.find(_ => _.test.toString() === rule.test.toString()) || rule;
    }).concat(testConfig.module.rules.filter((rule) => {
        return !storybookBaseConfig.module.rules.find(_ => _.test.toString() === rule.test.toString());
    }));
    storybookBaseConfig.module.rules.filter(_ => _.test.test(".vue")).forEach((rule) => {
        rule.use[0].options.loaders.ts = {
            loader: 'ts-loader',
            options: {
                appendTsSuffixTo: [/\.vue$/],
                happyPackMode: true,
            },
        };
        rule.use[0].options.loaders.scss = 'vue-style-loader!css-loader!sass-loader';
        rule.use[0].options.loaders.sass = 'vue-style-loader!css-loader!sass-loader?indentedSyntax';
    });
    storybookBaseConfig.module.rules.push({
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
    });
    storybookBaseConfig.module.rules.push({
        test: /\.(woff|woff2|eot|ttf|svg)$/,
        loader: 'file-loader?name=../font/[name].[ext]',
    });

    storybookBaseConfig.resolve = testConfig.resolve;
    Object.assign(storybookBaseConfig.resolve.alias, {
        "electron": path.resolve(__dirname, '../mocks/electron'),
        "electron-ipc": path.resolve(__dirname, '../mocks/electron-ipc'),
        "electron-context-menu": path.resolve(__dirname, '../mocks/electron-context-menu'),
    });

    storybookBaseConfig.node = testConfig.node;
    storybookBaseConfig.devtool = testConfig.devtool;
    storybookBaseConfig.devServer = testConfig.devServer;
    // storybookBaseConfig.externals = testConfig.externals;
    storybookBaseConfig.performance = testConfig.performance;
    storybookBaseConfig.plugins = storybookBaseConfig.plugins.concat(testConfig.plugins);

    return storybookBaseConfig;
};
