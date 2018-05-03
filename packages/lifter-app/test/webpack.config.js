let path = require("path");
let ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

module.exports = {
    resolve: {
        alias: {
            vue$: "vue/dist/vue.esm.js",
        },
        extensions: [".ts", ".tsx", ".css", ".js", ".vue"],
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                use: [
                    {
                        loader: "vue-loader",
                        options: {
                            loaders: {
                                i18n: "@kazupon/vue-i18n-loader",
                            },
                        },
                    },
                ],
            },
            {
                test: /\.ts$/,
                use: [
                    {
                        loader: "ts-loader",
                        options: {
                            appendTsSuffixTo: [/\.vue$/],
                            configFile: path.join(__dirname, "tsconfig.json"),
                            happyPackMode: true,
                        },
                    },
                ],
            },
        ],
    },
    node: {
        __dirname: true,
        __filename: true,
    },
    devServer: {
        historyApiFallback: true,
        noInfo: true,
    },
    devtool: "inline-cheap-module-source-map",
    externals: [
        (context, request, callback) => {
            let exclude = () => callback(null, `commonjs ${request}`);

            if (request.match(/^\//)) {
                return callback();
            }
            if (request.match(/^!/)) {
                return callback();
            }
            if (request.match(/^[\w@]/)) {
                return exclude();
            }

            let normalizePath = path.normalize(path.join(context, request));
            if (normalizePath.match(/\/node_modules\/webpack\//)) {
                return callback();
            }
            if (
                normalizePath.match(
                    /\/node_modules\/element-ui\/lib\/locale\/lang\//,
                )
            ) {
                return callback();
            }
            if (normalizePath.match(/\/node_modules\/process\//)) {
                return callback();
            }
            if (normalizePath.match(/\/node_modules\/[-\w]+-loader\//)) {
                return callback();
            }
            if (normalizePath.match(/\/node_modules\//)) {
                return exclude();
            }

            callback();
        },
    ],
    performance: {
        hints: false,
    },
    plugins: [new ForkTsCheckerWebpackPlugin({ checkSyntacticErrors: true })],
};
