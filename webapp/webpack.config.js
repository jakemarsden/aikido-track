const cssnano = require('cssnano');
const path = require('path');
const zlib = require('zlib');

const CleanPlugin = require('clean-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = function (env) {
    const isForProd = env === 'production';
    const dir = {
        source: 'src',
        output: 'dist/static',
        libs: 'node_modules'
    };

    const entry = {
        'index': `./${dir.source}/app/module/member-details/main.js`
    };

    const plugins = [
        new CleanPlugin([`./${dir.output}`]),
        new MiniCssExtractPlugin({ filename: '[name].bundle.css' })
    ];
    if (isForProd) {
        const compressionPlugin = new CompressionPlugin({
            algorithm: 'gzip',
            cache: !isForProd,
            compressionOptions: { level: zlib.constants.Z_BEST_COMPRESSION },
            filename: '[path].gz',
            include: /\.(css|js)$/,
            minRatio: 0.8, // Skip assets which don't compress well
            threshold: 0 // In bytes. Skip assets which are already smaller than this
        });
        plugins.push(compressionPlugin);
    }
    Object.entries(entry)
            .map(it => {
                const [name, entryPoint] = it;
                return new HtmlPlugin({
                    chunks: [name, 'vendor'],
                    filename: `${name}.html`,
                    inject: 'head',
                    template: path.join(path.dirname(entryPoint), `${path.basename(entryPoint, '.js')}.html`)
                });
            })
            .forEach(it => plugins.push(it));

    const optimization = {
        minimize: isForProd,
        minimizer: [
            new OptimizeCssAssetsPlugin({ cssProcessor: cssnano }),
            new UglifyJsPlugin({
                cache: !isForProd,
                extractComments: {
                    // Separate license comments from the main bundle and add a comment explaining where to find them
                    condition: /^\**!|@css_on|@license|@preserve/,
                    banner: licenseFileName => `For license information please see ${licenseFileName}`,
                    filename: sourceFileName => `${sourceFileName}.LICENSE`
                },
                parallel: true,
                sourceMap: true,
                uglifyOptions: {
                    compress: true,
                    mangle: true
                }
            })
        ],
        splitChunks: {
            cacheGroups: {
                commons: {
                    chunks: 'all',
                    name: 'vendor',
                    test: /[\\/]node_modules[\\/]/
                }
            }
        }
    };

    const output = {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, dir.output)
    };

    const rules = [
        {
            // Stylesheets
            test: /\.s?css$/,
            use: [
                MiniCssExtractPlugin.loader,
                {
                    loader: 'css-loader',
                    options: { sourceMap: isForProd }
                },
                {
                    // See: https://webpack.js.org/loaders/sass-loader/#problems-with-url-
                    loader: 'resolve-url-loader'
                },
                {
                    loader: 'sass-loader',
                    options: {
                        implementation: require('node-sass'),
                        includePaths: [dir.libs],
                        precision: 4,
                        sourceComments: !isForProd, // Insert a comment for each selector marking which file originally
                                                    // defined it
                        sourceMap: true // 'resolve-url-loader' requires source maps to do its job
                    }
                }
            ]
        },
        {
            // Fonts
            test: /\.(eot|otf|ttf|woff|woff2)$/,
            use: [
                {
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'font'
                    }
                }
            ]
        },
        {
            // Images
            test: /\.(gif|jpe?g|png|svg)$/,
            use: [
                {
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'image'
                    }
                },
                {
                    loader: 'image-webpack-loader',
                    options: { disable: !isForProd },
                }
            ]
        }
    ];

    const speedMeasurePlugin = new SpeedMeasurePlugin({ outputFormat: 'human' });
    return speedMeasurePlugin.wrap({
        devtool: 'source-map',
        entry,
        mode: isForProd ? 'production' : 'development',
        module: { rules },
        optimization,
        output,
        plugins
    });
};
