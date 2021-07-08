// 上传sourcemap文件插件
const glob = require('glob')
const path = require('path')
const fs = require('fs')
const http = require('http')
class UploadSourceMapWebPackPlugin {
  constructor(options) {
    this.options = options
  }
  apply(compiler) {
    // 只在生产环境打包时上送sourcemap
    if (process.env.NODE_ENV === 'production') {
      // 定义在打包后执行
      compiler.hooks.done.tap('uploadSourceMapWebPackPlugin', async status => {
        // 读取sourcemap文件
        const list = glob.sync(path.join(status.compilation.outputOptions.path, './**/*.{js.map,}'))
        for (let filename of list) {
          await this.upload(this.options.url, filename)
        }
      })
    }
  }
  // 上传文件方法
  upload(url, file) {
    return new Promise(resolve => {
      const req = http.request(
        `${url}?name=${path.basename(file)}`,
        {
          method: "POST",
          headers: {
            'Content-Type': 'application/octet-stream',
            Connection: 'keep-alive',
            'Transfer-Encoding': 'chunked'
          }
        }
      )
      // 读取文件并给到上送请求对象
      fs.createReadStream(file).on('data', chunk => {
        req.write(chunk)
      }).on('end', () => {
        req.end();
        resolve();
      })
    })
  }
}

module.exports = UploadSourceMapWebPackPlugin;