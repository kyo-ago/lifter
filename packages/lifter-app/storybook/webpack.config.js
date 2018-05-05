const path = require("path");
const webpackMerge = require("webpack-merge");
const testConfig = require("../test/webpack.config");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = storybookBaseConfig => {
    storybookBaseConfig.module.rules = storybookBaseConfig.module.rules.filter(
        rule => !rule.test.test(".vue"),
    );
    delete testConfig.externals;
    let resultConfig = webpackMerge.smart(storybookBaseConfig, testConfig, {
        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: ExtractTextPlugin.extract({
                        fallback: "style-loader",
                        use: "css-loader",
                    }),
                },
                {
                    test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                    use: {
                        loader: "url-loader",
                        options: {
                            limit: 10240,
                            name: "fonts/[name]--[folder].[ext]",
                        },
                    },
                },
            ],
        },
        plugins: [new ExtractTextPlugin("styles.css")],
        resolve: {
            alias: {
                electron: path.resolve(__dirname, "../mocks/electron"),
                "electron-ipc": path.resolve(
                    __dirname,
                    "../mocks/electron-ipc",
                ),
                "electron-context-menu": path.resolve(
                    __dirname,
                    "../mocks/electron-context-menu",
                ),
            },
        },
    });
    return resultConfig;
};
