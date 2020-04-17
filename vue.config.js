const path = require("path");

module.exports = {
  publicPath: './',
  outputDir: 'dist',

  lintOnSave: true,

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
      .filename('js/[name]-[hash].js')
      .chunkFilename('js/[name]-[hash].js')
      .end();

    config.resolve.alias.set(
      "images",
      path.join(__dirname, "src/assets/img")
    );

    //忽略的打包文件
    config.externals({
      vue: "Vue",
      "vue-router": "VueRouter",
      vuex: "Vuex",
      axios: "axios",
      "element-ui": "ELEMENT",
      "ant-design-vue": "antd"
    });

    const plugins = config.plugins;
    ["app"].forEach(key => {
      plugins.delete(`prefetch-${key}`)
      plugins.delete(`preload-${key}`)
    });

  },
  configureWebpack: () => {
    // if (process.env.NODE_ENV === "production") {
    //   try {
    //     const compress =
    //       config.optimization.minimizer[0].options.terserOptions.compress;

    //     config.optimization.minimizer[0].options.terserOptions.compress = {
    //       ...compress,
    //       drop_debugger: true,
    //       pure_funcs: [
    //         "console.log",
    //         "console.info",
    //         "console.debug",
    //         "console.error"
    //       ]
    //     };
    //   } catch (e) {
    //     console.error(e);
    //   }
    // }
  },


  productionSourceMap: false,
  filenameHashing: true,

  css: {
    extract: true,
    sourceMap: false
  },


  devServer: {
    disableHostCheck: true,
    host: '0.0.0.0',
    open: false,
    port: 8081,
    https: false,
    hotOnly: false
  },

  // 三方插件的选项
  pluginOptions: {
  }
}
