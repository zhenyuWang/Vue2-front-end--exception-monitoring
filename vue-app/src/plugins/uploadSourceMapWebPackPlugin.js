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
    // 打包时上送sourcemap
    console.log('upload sourcemap apply')
    // 通过环境变量判断当前环境
    let env = '';
    if (process.env.VUE_APP_BASE_API === '测试环境地址') {
      env = 'uat'
    } else if (process.env.VUE_APP_BASE_API === '生产环境地址') {
      env = 'prod'
    }
    console.log('apply env',env);
    // 定义在打包后执行
    compiler.hooks.done.tap('uploadSourceMapWebPackPlugin', async status => {
      // 读取sourcemap文件
      const list = glob.sync(path.join(status.compilation.outputOptions.path, './**/*.{js.map,}'))
      for (const filename of list) {
        await this.upload(this.options.url, filename, env)
        await fs.unlinkSync(filename)
      }
    })
  }
  // 上传文件方法
  upload(url, file,env) {
    console.log('env',env)
    return new Promise(resolve => {
      const req = http.request(
        `${url}?name=${path.basename(file)}&&env=${env}`,
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