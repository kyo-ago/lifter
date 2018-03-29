let path = require("path");

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
                test: /\.js/,
                exclude: /node_modules/,
            },
            {
                test: /\.vue$/,
                exclude: /node_modules/,
                use: {
                    loader: "vue-loader",
                    options: {
                        loaders: {
                            scss: "vue-style-loader!css-loader!sass-loader",
                            i18n: "@kazupon/vue-i18n-loader"
                        },
                    },
                },
            },
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                loader: "ts-loader",
                options: {
                    appendTsSuffixTo: [/\.vue$/],
                    configFile: "test/tsconfig.json"
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
};
