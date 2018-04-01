let path = require("path");
let ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = {
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js'
        },
        extensions: [ '.ts', '.tsx', '.css', '.js', ".vue" ]
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                exclude: /node_modules/,
                use: {
                    loader: "vue-loader",
                    options: {
                        cssSourceMap: false,
                        loaders: {
                            i18n: "@kazupon/vue-i18n-loader"
                        },
                    },
                },
            },
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: {
                    loader: "ts-loader",
                    options: {
                        appendTsSuffixTo: [/\.vue$/],
                        configFile: "test/tsconfig.json",
                        happyPackMode: true,
                    },
                },
            },
        ]
    },
    node: {
        __dirname: true,
        __filename: true
    },
    devServer: {
        historyApiFallback: true,
        noInfo: true
    },
    performance: {
        hints: false
    },
    devtool: 'inline-cheap-module-source-map',
    externals: [(context, request, callback) => {
        if (request.match(/^\//)) {
            return callback();
        }
        if (request.match(/^!/)) {
            return callback();
        }
        if (request.match(/^[\w@]/)) {
            return callback(null, `commonjs ${request}`);
        }
        let normalizePath = path.normalize(path.join(context, request));
        if (normalizePath.match(/\/node_modules\/webpack\//)) {
            return callback();
        }
        if (normalizePath.match(/\/element-ui\/lib\/locale\/lang\//)) {
            return callback();
        }
        if (normalizePath.match(/\/node_modules\/[-\w]+-loader\//)) {
            return callback();
        }
        if (normalizePath.match(/\/node_modules\//)) {
            return callback(null, `commonjs ${request}`);
        }
        callback();
    }],
    plugins: [
        new ForkTsCheckerWebpackPlugin({ checkSyntacticErrors: true }),
    ],
};
