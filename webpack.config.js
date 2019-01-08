const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
    mode: 'development',
    devtool: 'source-map',
    entry: {
        'app': './src/index.ts'
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
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
        extensions: [ '.tsx', '.ts', '.vue' ],
        modules: [ path.resolve('./src'), 'node_modules' ]
    },
    output: {
        filename: 'dist/[name].js',
        path: path.resolve(__dirname, 'bin')
    },
    plugins: [
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