const path = require("path");
const webpackMerge = require('webpack-merge');
const testConfig = require("../test/webpack.config");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = (storybookBaseConfig) => {
    storybookBaseConfig.module.rules = storybookBaseConfig.module.rules.filter((item) => {
        return !(item.test.toString().match(/\.vue\W/));
    });
    delete testConfig.externals;
    let resultConfig = webpackMerge.smart(
        storybookBaseConfig,
        testConfig,
        {
            module: {
                rules: [
                    {
                        test: /\.vue$/,
                        use: [
                            {
                                loader: "vue-loader",
                                options: {
                                    extractCSS: true,
                                    loaders: {
                                        ts: {
                                            loader: 'ts-loader',
                                            options: {
                                                appendTsSuffixTo: [/\.vue$/],
                                                happyPackMode: true,
                                            },
                                        },
                                        scss: 'vue-style-loader!css-loader!sass-loader',
                                        sass: 'vue-style-loader!css-loader!sass-loader?indentedSyntax',
                                    },
                                },
                            },
                        ],
                    },
                    {
                        test: /\.css$/,
                        use: ExtractTextPlugin.extract({
                            fallback: "style-loader",
                            use: "css-loader"
                        }),
                    },
                    {
                        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                        use: {
                            loader: "url-loader",
                            options: {
                                limit: 10240,
                                name: "fonts/[name]--[folder].[ext]"
                            }
                        }
                    },
                ],
            },
            plugins: [
                new ExtractTextPlugin("styles.css"),
            ],
            resolve: {
                alias: {
                    "electron": path.resolve(__dirname, '../mocks/electron'),
                    "electron-ipc": path.resolve(__dirname, '../mocks/electron-ipc'),
                    "electron-context-menu": path.resolve(__dirname, '../mocks/electron-context-menu'),
                },
            },
        }
    );
    return resultConfig;
};
