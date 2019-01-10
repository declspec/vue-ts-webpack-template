const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    mode: 'production',
    devtool: 'source-map',
    entry: {
        'app': './src/index.ts'
    },
    module: {
        rules: [
             // Css / SASS rules
             { 
                test: /\.s?css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader'
                ]
            },
            // Vue rules
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            // TypeScript rules
            {
                test: /\.tsx?$/,
                exclude: /[\/\\]node_modules[\/\\]/,
                use: {
                    loader: 'ts-loader',
                    options: {
                        appendTsSuffixTo: [ /\.vue$/ ]
                    }
                }
            }
        ]
    },
    resolve: {
        extensions: [ '.js', '.tsx', '.ts', '.vue' ],
        modules: [ path.resolve('./src'), 'node_modules' ]
    },
    output: {
        filename: 'dist/[name].js',
        path: path.resolve(__dirname, 'bin')
    },
    plugins: [
        new MiniCssExtractPlugin({ filename: '[name].css' }),
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({ 
            title: 'Vue Prototype', 
            filename: 'index.html', 
            inject: false,
            chunks: [ 'app' ],
            template: './src/template.html'
        })
    ]
}