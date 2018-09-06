const path = require('path');
const webpack = require('webpack');

const CleanPlugin = require('clean-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = function (env) {
    const isForProd = env === 'production';
    const maxInlineFileSize = 1024; // in bytes
    const dir = {
        source: 'src',
        output: 'dist/static'
    };

    return {
        entry: `./${dir.source}/common/index.js`,

        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    loader: 'babel-loader',
                    options: {
                        presets: ['es2015'],
                        plugins: ['syntax-dynamic-import']
                    }
                },
                {
                    test: /\.css$/,
                    use: [
                        { loader: MiniCssExtractPlugin.loader },
                        {
                            loader: 'css-loader',
                            options: { sourceMap: true }
                        }
                    ]
                },
                {
                    test: /\.(gif|jpg|png|svg)$/,
                    loader: 'url-loader',
                    options: {
                        name: '[name]-[hash].[ext]',
                        outputPath: 'image',
                        limit: maxInlineFileSize
                    }
                },
                {
                    test: /.(eot|otf|svg|ttf|woff(2)?)(\?[a-z0-9]+)?$/,
                    loader: 'url-loader',
                    options: {
                        name: '[name]-[hash].[ext]',
                        outputPath: 'font',
                        limit: maxInlineFileSize
                    }
                },
            ]
        },

        plugins: [
            new CleanPlugin([dir.output]),
            new HtmlPlugin({ template: path.join(__dirname, dir.source, 'index.html') }),
            new MiniCssExtractPlugin({ fileName: '[name]-[contenthash].css' }),
            new UglifyJsPlugin({ sourceMap: true }),
            new webpack.HashedModuleIdsPlugin()
        ],

        output: {
            filename: '[name]-[contenthash].bundle.js',
            path: path.resolve(__dirname, dir.output)
        },

        devtool: isForProd ? 'source-map' : 'cheap-eval-source-map',

        optimization: {
            runtimeChunk: 'single',
            splitChunks: {
                cacheGroups: {
                    styles: {
                        name: 'style',
                        chunks: 'all',
                        enforce: true,
                        test: /\.css$/
                    },
                    vendor: {
                        name: 'vendor',
                        chunks: 'all',
                        test: /[\\/]node_modules[\\/]/
                    }
                }
            },
            minimizer: [
                new OptimizeCssAssetsPlugin({}),
                new UglifyJsPlugin({
                    cache: true,
                    parallel: true,
                    sourceMap: true
                })
            ]
        }
    };
};
