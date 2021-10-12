// 引入upload sourcemap webpack plugin
const UploadSourceMapWebPackPlugin = require('./src/plugins/uploadSourceMapWebPackPlugin')
module.exports = {
  publicPath: "./",
  outputDir: "dist", // 项目打包输出目录
  assetsDir: "static", // 项目静态文件打包输出目录
  lintOnSave: process.env.NODE_ENV === "development", // 是否在开发环境下通过 eslint-loader 在每次保存时 lint 代码。这个值会在 @vue/cli-plugin-eslint 被安装之后生效。
  productionSourceMap: true,
  configureWebpack: {
    plugins: [
      // 使用 upload sourcemap webpack plugin
      new UploadSourceMapWebPackPlugin({
        handleTargetFolderUrl:`${process.env.VUE_APP_MONITOR_BASE_API}/mointor/emptyFolder`,
        uploadUrl: `${process.env.VUE_APP_MONITOR_BASE_API}/mointor/uploadSourceMap`
      })
    ]
  }
}