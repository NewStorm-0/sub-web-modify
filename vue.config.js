const path = require('path')
const webpack = require('webpack')

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  },

  chainWebpack: config => {
    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()
  },
  
  // <-- 新增：解决 Webpack 5 找不到 'buffer' 的问题 -->
  configureWebpack: {
    resolve: {
      fallback: {
        // 解决 'buffer' 模块找不到的问题
        "buffer": require.resolve("buffer/"),
        // "process" 变量由 ProvidePlugin 处理
        "process": false 
      }
    },
    plugins: [
      // 解决全局变量 Buffer 和 process 的问题
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
        process: 'process/browser', 
      }),
    ],
  }
};