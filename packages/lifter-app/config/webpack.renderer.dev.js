module.exports = {
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
        ],
    },
};
