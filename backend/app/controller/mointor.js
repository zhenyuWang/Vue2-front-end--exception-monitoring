'use strict';
const Controller = require('egg').Controller;
const path = require('path');
const fs = require('fs');
const StackParser = require('../utils/stackparser');
const sendMail = require('../utils/sendMail');

class HomeController extends Controller {
  // 前端打包时，上送sourcemap文件
  async uploadSourceMap() {
    const { ctx } = this;
    const stream = ctx.req;
    const filename = ctx.query.name;
    const dir = path.join(this.config.baseDir, 'upload');
    // 判断upload文件夹是否存在
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    const target = path.join(dir, filename);
    const writeStream = fs.createWriteStream(target);
    stream.pipe(writeStream);
  }
  // 前端报错，上报error
  async reportError() {
    const { ctx } = this;
    const { location, message, stack, component } = ctx.request.body;
    const sourceMapDir = path.join(this.config.baseDir, 'upload');
    const stackParser = new StackParser(sourceMapDir);
    const errInfo = await stackParser.parseStackTrack(stack, message);
    const mailMsg = `
    <h3>message:${message}</h3><br/>
    <p>component:${component}</p><br/>
    <p>source:${errInfo.source}</p><br/>
    <p>line::${errInfo.line}</p><br/>
    <p>column:${errInfo.column}</p><br/>
    <p>name::${errInfo.name}</p>
    `;
    sendMail('1174352324@qq.com', 'nldmfvszvpnjjeid', '13641039885@163.com', location, mailMsg);
    ctx.body = {
      header: {
        code: 0,
        message: 'OK',
      },
    };
    ctx.status = 200;
  }

}

module.exports = HomeController;
