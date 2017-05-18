const path = require('path')
const debug = require('debug')('app:config')
const consts = require('./config.json')

debug('正在创建配置.')
const dev = consts[process.env.NODE_ENV.toUpperCase()]
const config = {
    // process 是一个全局变量，即 global 对象的属性.它用于描述当前Node.js 进程状态的对象，提供了一个与操作系统的简单接口
    env : process.env.NODE_ENV || 'development',

    // ----------------------------------
    // Project Structure
    // ----------------------------------
    path_base  : path.resolve(__dirname, '..'),
    dir_client : 'src',
    dir_dist   : 'dist',
    dir_public : 'public',
    dir_server : 'server',
    dir_test   : 'tests',

    // ----------------------------------
    // Server Configuration
    // ----------------------------------
    server_host : dev.cdnHost,
    api_host : dev.apiHost,
    server_port : dev.port || 3000,

    // ----------------------------------
    // Compiler Configuration
    // ----------------------------------
    compiler_babel : {
        cacheDirectory : true,
        plugins        : ['transform-runtime', ['import', { libraryName: 'antd', style: 'css' }]],
        presets        : ['es2015', 'react', 'stage-0']
    },
    compiler_devtool         : 'source-map',
    compiler_hash_type       : 'hash',
    compiler_fail_on_warning : false,
    compiler_quiet           : false,
    compiler_public_path     : '/',
    compiler_stats           : {
        chunks : false,
        chunkModules : false,
        colors : true
    },
    compiler_vendors : [
        'react',
        'react-redux',
        'react-router',
        'redux'
        // 'antd'
    ],
    coverage_reporters : [
        { type : 'text-summary' },
        { type : 'lcov', dir : 'coverage' }
    ],
    banner:consts.BANNER,
    template_dir:consts.TEMPLATES_DIR
}
// 此处添加的全局变量也必须添加到.eslintrc中
config.globals = {
    'process.env'  : {
        'NODE_ENV' : JSON.stringify(config.env !== 'development' ? 'production' : 'development')
    },
    'NODE_ENV'     : JSON.stringify(config.env),
    '__DEV__'      : config.env === 'development',
    '__PROD__'     : config.env === 'production',
    '__QA__'       : config.env === 'qa',
    '__TEST__'     : config.env === 'test'
}
function base() {
    const args = [config.path_base].concat([].slice.call(arguments))
    return path.resolve.apply(path, args)
}

config.utils_paths = {
    base   : base,
    client : base.bind(null, config.dir_client),
    dist   : base.bind(null, config.dir_dist),
    public   : base.bind(null, config.dir_public)
}

module.exports = config
