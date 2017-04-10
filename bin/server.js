/**
 * Created by xwatson on 2016/12/8.
 */
const express = require('express')
const debug = require('debug')('app:server')
const webpack = require('webpack')
const webpackConfig = require('../build/webpack.config')
const config = require('../config')
const port = config.server_port
const app = express()
const paths = config.utils_paths

// 默认索引为根目录下的index.html
app.use(require('connect-history-api-fallback')())

// ------------------------------------
// 热更新中间件
// ------------------------------------
if (config.env === 'development') {
    const compiler = webpack(webpackConfig)

    // 开发时候你需要运行你的应用，就需要一个server， webpack-dev-server 其实就是封装了 express 的一个server，里面又使用了一个中间件
    // webpack-dev-middleware 来把webpack编译的文件放在内存中，请求资源时候都是从内存中取，编译过程也是在内存中运行，所以速度非常快。
    debug('启用 dev 和 HMR 中间件')
    app.use(require('webpack-dev-middleware')(compiler, {
        publicPath  : webpackConfig.output.publicPath,
        contentBase : paths.client(),
        hot         : true,
        quiet       : config.compiler_quiet,
        noInfo      : config.compiler_quiet,
        lazy        : false,
        stats       : config.compiler_stats
    }))
    app.use(require('webpack-hot-middleware')(compiler))
    // 指定静态资源
    app.use(express.static(paths.public()))
} else {
    debug('服务运行在非开发者模式下，启用默认访问dist.')
    app.use(express.static(paths.dist()))
}

app.listen(port)
debug(`服务已运行，访问 http://localhost:${port}.`)
