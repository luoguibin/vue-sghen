const path = require("path");

module.exports = {
  publicPath: './',
  outputDir: 'dist',

  lintOnSave: false,

  pages: {
    app: {
      entry: './src/main',
      template: './public/index.html',
      filename: 'index.html'
    },
    app2: {
      entry: './src2/main',
    },
    app3: {
      entry: './src3/main',
      template: './public/index3.html',
      filename: 'index3.html'
    }
  },

  chainWebpack: config => {
    config
      .output
      .filename('js/[name].js?[hash]')
      .chunkFilename('js/[name].js?[hash]')
      .end();

    config.resolve.alias.set(
      "images",
      path.join(__dirname, "src/assets/img")
    );

    //忽略的打包文件
    // config.externals({
    //   vue: "Vue",
    //   "vue-router": "VueRouter",
    //   vuex: "Vuex",
    //   axios: "axios",
    //   "element-ui": "ELEMENT"
    // });

    const plugins = config.plugins;
    ["app", "app2", "app3"].forEach(key => {
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
    port: 8080,
    https: false,
    hotOnly: false,
    proxy: null
  },

  // 三方插件的选项
  pluginOptions: {
  }
}
