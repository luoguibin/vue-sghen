module.exports = {
  publicPath: './',
  outputDir: 'dist',

  lintOnSave: false,

  pages: {
    app: {
      entry: './src/main',
      template: './public/index.html',
      filename: 'index.html'
    }
  },

  chainWebpack: config => {
    config
      .output
      .filename('js/[name].js?[hash]')
      .chunkFilename('js/[name].js?[hash]')
      .end()

    config.plugins.delete('prefetch')
  },
  configureWebpack: () => {
  },


  productionSourceMap: false,
  filenameHashing: true,

  css: {
    extract: true,
    sourceMap: false
  },


  devServer: {
    port: 8080,
    https: false,
    hotOnly: false,
    proxy: null
  },

  // 三方插件的选项
  pluginOptions: {
  }
}
