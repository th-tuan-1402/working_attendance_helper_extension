// Generated using webpack-cli https://github.com/webpack/webpack-cli
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

const isProduction = process.env.NODE_ENV == 'production';


const config = {
    entry: {
        popup: './src/popup.js',
        option: './src/option.js',
        "content-script": './src/content-script.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        clean: true
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                { from: './src/static'}
            ]
        })
    ],
    module: {
        rules: [
            {
                test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
                type: 'asset',
            },

            // Add your rules for custom modules here
            // Learn more about loaders from https://webpack.js.org/loaders/
        ],
    }
};

module.exports = () => {
    if (isProduction) {
        const TerserPlugin = require("terser-webpack-plugin");
        config.mode = 'production';

        config.optimization = {
            minimize: true,
            minimizer: [
                new TerserPlugin({
                    terserOptions: {
                        compress: {
                            drop_console: true
                        }
                    }
                })
            ]
        }

    } else {
        config.mode = 'development';
        config.devtool = 'source-map'
    }
    return config;
};
