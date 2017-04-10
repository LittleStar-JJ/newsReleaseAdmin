const webpack = require('webpack')
const cssnano = require('cssnano')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const config = require('../config')
const debug = require('debug')('app:webpack:config')

const paths = config.utils_paths
const __DEV__ = config.globals.__DEV__
const __PROD__ = config.globals.__PROD__
const __TEST__ = config.globals.__TEST__

debug('创建webpack配置.')
const webpackConfig = {
    name: 'client',
    target: 'web',
    devtool: config.compiler_devtool,
    resolve: {
        root: paths.client(),
        extensions: ['', '.js', '.jsx', '.json']
    },
    module: {}
}

// main入口路径
const APP_ENTRY = paths.client('main.js')

webpackConfig.entry = {
    app: __DEV__ ?
        [APP_ENTRY].concat(`webpack-hot-middleware/client?path=${config.compiler_public_path}__webpack_hmr`) :
        [APP_ENTRY],
    vendor: config.compiler_vendors
}

// 输出
webpackConfig.output = {
    filename: `[name].[${config.compiler_hash_type}].js`,
    path: paths.dist(),
    publicPath: config.compiler_public_path
}

webpackConfig.plugins = [
    new webpack.DefinePlugin(config.globals),
    new HtmlWebpackPlugin({ // 根据模板插入css/js等生成最终HTML
        template: paths.client(config.template_dir + '/index.html'), // 模板文件路径，支持加载器，比如 html!./index.html
        hash: false, //  如果为 true, 将添加一个唯一的 webpack 编译 hash 到所有包含的脚本和 CSS 文件，对于解除 cache 很有用
        favicon: paths.public('favicon.ico'), // 添加特定的 favicon 路径到输出的 HTML 文件中
        filename: 'index.html', // 输出的 HTML 文件名
        inject: 'body', // 注入所有的资源到特定的
        minify: { //  传递 html-minifier 选项给 minify 输出
            collapseWhitespace: true
        }
    })
]

if (__DEV__) {
    debug('启用实时开发插件(HMR，NoErrors).')
    webpackConfig.plugins.push(
        // 热替换功能，需要增加HotModuleReplacementPlugin，不刷新浏览器，只更新修改过的代码，
        // 需要使用的代码模块开启支持 module.hot ，并开启 module.hot.accept() ;
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
    )
} else if (__PROD__) {
    debug('启用生产插件 (OccurenceOrder, Dedupe & UglifyJS).')
    webpackConfig.plugins.push(
        new webpack.BannerPlugin(config.banner),
        // 根据调用顺序自动排序
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({ // 压缩代码
            compress: {
                unused: true,
                dead_code: true,
                warnings: false,
                drop_debugger: true,
                drop_console: true
            }
        })
    )
} else {
    debug(`启用${config.env}插件 (OccurenceOrder, Dedupe, UglifyJS).`)
    webpackConfig.plugins.push(
        new webpack.BannerPlugin(config.banner),
        // 根据调用顺序自动排序
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                unused: true,
                dead_code: true,
                warnings: false
            }
        })
    )
}

// 非测试环境提取公共代码
if (!__TEST__) {
    webpackConfig.plugins.push(
        // 把第三方的框架或库和自己的代码分开了打包,避免引用了第三方库的文件重复打包第三方库
        new webpack.optimize.CommonsChunkPlugin({
            names: ['vendor']
        })
    )
}

// ------------------------------------
// 加载器
// ------------------------------------
webpackConfig.module.loaders = [{
    test: /\.(js|jsx)$/,
    exclude: /node_modules/,
    loader: 'babel'
}, {
    test: /\.json$/,
    loader: 'json'
}]

// ------------------------------------
// Style Loaders
// ------------------------------------
// 使用 cssnano 和 postcss loader, 不重复最小化.
const BASE_CSS_LOADER = 'css?sourceMap&-minimize'

webpackConfig.module.loaders.push({
    test: /\.scss$/,
    exclude: null,
    loaders: [
        'style',
        BASE_CSS_LOADER,
        'postcss',
        'sass?sourceMap'
    ]
})
webpackConfig.module.loaders.push({
    test: /\.css$/,
    exclude: null,
    loaders: [
        'style',
        BASE_CSS_LOADER,
        'postcss'
    ]
})

webpackConfig.sassLoader = {
    includePaths: paths.client('styles')
}

webpackConfig.postcss = [
    cssnano({
        autoprefixer: {
            add: true,
            remove: true,
            browsers: ['last 2 versions']
        },
        discardComments: {
            removeAll: true
        },
        discardUnused: false,
        mergeIdents: false,
        reduceIdents: false,
        safe: true,
        sourcemap: true
    })
]

// 文件 loaders
/* eslint-disable */
webpackConfig.module.loaders.push(
    {
        test: /\.woff(\?.*)?$/,
        loader: 'url?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/font-woff'
    },
    {
        test: /\.woff2(\?.*)?$/,
        loader: 'url?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/font-woff2'
    },
    {test: /\.otf(\?.*)?$/, loader: 'file?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=font/opentype'},
    {
        test: /\.ttf(\?.*)?$/,
        loader: 'url?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/octet-stream'
    },
    {test: /\.eot(\?.*)?$/, loader: 'file?prefix=fonts/&name=[path][name].[ext]'},
    {test: /\.svg(\?.*)?$/, loader: 'url?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=image/svg+xml'},
    {test: /\.(png|jpg)$/, loader: 'url?limit=8192'}
)
/* eslint-enable */

// ------------------------------------
// Finalize Configuration
// ------------------------------------
// 当不知道公共路径 (只有当HMR启用在development下) 需要使用extractTextPlugin来解决
if (!__DEV__) {
    debug('应用 ExtractTextPlugin 到 CSS loaders.')
    webpackConfig.module.loaders.filter((loader) =>
        loader.loaders && loader.loaders.find((name) => /css/.test(name.split('?')[0]))
    ).forEach((loader) => {
        const first = loader.loaders[0]
        const rest = loader.loaders.slice(1)
        loader.loader = ExtractTextPlugin.extract(first, rest.join('!'))
        delete loader.loaders
    })

    webpackConfig.plugins.push(
        new ExtractTextPlugin('[name].[contenthash].css', {
            allChunks: true
        })
    )
}

module.exports = webpackConfig
