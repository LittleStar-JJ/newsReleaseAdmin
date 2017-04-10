/**
 * Created by xwatson on 2016/12/8.
 */
const webpack = require('webpack')
const debug = require('debug')('app:build:webpack-compiler')
const config = require('../config')
require('colors')

function webpackCompiler(webpackConfig, statsFormat) {
    statsFormat = statsFormat || config.compiler_stats

    return new Promise((resolve, reject) => {
        const compiler = webpack(webpackConfig)

        compiler.run((err, stats) => {
            if (err) {
                debug('Webpack 编译遇到致命错误:', err)
                return reject(err)
            }
            const jsonStats = stats.toJson()
            console.log('  Name                                 Size'.white.bold)
            jsonStats.assets.forEach((item) => {
                console.log(('  ' + item.name + '     ' + item.size).green)
            })
            // debug(stats.toString(statsFormat))
            console.log('  用时: '.yellow.bold + ((jsonStats.time / 1000) + 's').cyan)
            if (jsonStats.errors.length > 0) {
                debug('Webpack 编译遇到错误.')
                debug(jsonStats.errors.join('\n'))
                return reject(new Error('Webpack 编译遇到错误'))
            } else if (jsonStats.warnings.length > 0) {
                // debug('Webpack 编译遇到警告.')
                // debug(jsonStats.warnings.join('\n'))
            } else {
                debug('未遇到错误或警告.')
            }
            resolve(jsonStats)
        })
    })
}

module.exports = webpackCompiler
