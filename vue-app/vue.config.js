const UploadSourceMapWebPackPlugin = require('./src/plugin/uploadSourceMapWebPackPlugin')
module.exports = {
  publicPath: "./",
  outputDir: "dist", // 项目打包输出目录
  assetsDir: "static", // 项目静态文件打包输出目录
  lintOnSave: process.env.NODE_ENV === "development", // 是否在开发环境下通过 eslint-loader 在每次保存时 lint 代码。这个值会在 @vue/cli-plugin-eslint 被安装之后生效。
  productionSourceMap: process.env.NODE_ENV === "production", // 生产环境打开sourcemap文件生成，方便打包的时候上传到异常监控后台
  configureWebpack: {
    plugins: [
      new UploadSourceMapWebPackPlugin({
        url: `${process.env.VUE_APP_MONITOR_BASE_API}/mointor/uploadSourceMap`
      })
    ]
  }
}