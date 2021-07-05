const UploadSourceMapWebPackPlugin = require('./src/plugin/uploadSourceMapWebPackPlugin')
module.exports = {
  publicPath: "./",
  outputDir: "dist", // 项目打包输出目录
  assetsDir: "static", // 项目静态文件打包输出目录
  lintOnSave: process.env.NODE_ENV === "development", // 是否在开发环境下通过 eslint-loader 在每次保存时 lint 代码。这个值会在 @vue/cli-plugin-eslint 被安装之后生效。
  productionSourceMap: true, // 如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建
  configureWebpack: {
    plugins: [
      new UploadSourceMapWebPackPlugin({
        url: 'http://127.0.0.1:7001/mointor/uploadSourceMap',
      })
    ]
  }
}