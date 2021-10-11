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
    const stream = ctx.req,
      filename = ctx.query.name,
      env = ctx.query.env;
    const dir = path.join(this.config.baseDir, `upload/${env}`);
    // 判断upload/env文件夹是否存在
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
    const { environment, location, message, stack, component, browserInfo, userId, userName, routerHistory, clickHistory } = ctx.request.body;
    let env = '';
    if (environment === '测试环境') {
      env = 'uat';
    } else if (environment === '生产环境') {
      env = 'prod';
    }
    // 组合sourcemap文件路径
    const sourceMapDir = path.join(this.config.baseDir, `upload/${env}`);
    // 解析报错信息
    const stackParser = new StackParser(sourceMapDir);
    let routerHistoryStr = '<h3>router history</h3>',
      clickHistoryStr = '<h3>click history</h3>';
      // 组合路由历史信息
    routerHistory && routerHistory.length && routerHistory.forEach(item => {
      routerHistoryStr += `<p>name:${item.name} | fullPath:${item.fullPath}</p>`;
      routerHistoryStr += `<p>params:${JSON.stringify(item.params)} | query:${JSON.stringify(item.query)}</p><p>--------------------</p>`;
    });
    // 组合点击历史信息
    clickHistory && clickHistory.length && clickHistory.forEach(item => {
      clickHistoryStr += `<p>pageX:${item.pageX} | pageY:${item.pageY}</p>`;
      clickHistoryStr += `<p>nodeName:${item.nodeName} | className:${item.className} | id:${item.id}</p>`;
      clickHistoryStr += `<p>innerText:${item.innerText}</p><p>--------------------</p>`;
    });
    // 通过上送的sourcemap文件，配合error信息，解析报错信息
    const errInfo = await stackParser.parseStackTrack(stack, message);
    console.log('errInfo', errInfo);
    // 获取当前时间
    const now = new Date();
    const time = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
    // 组织邮件正文
    const mailMsg = `
    <h3>message:${message}</h3>
    <h3>location:${location}</h3>
    <p>component:${component}</p>
    <p>source:${errInfo.source}</p>
    <p>line::${errInfo.lineNumber}</p>
    <p>column:${errInfo.columnNumber}</p>
    <p>fileName:${errInfo.fileName}</p>
    <p>functionName:${errInfo.functionName}</p>
    <p>time::${time}</p>
    <p>browserInfo::${browserInfo}</p>
    <p>userId::${userId}</p>
    <p>userName::${userName}</p>
    ${routerHistoryStr}
    ${clickHistoryStr}
    `;
    // sendMail('发件箱地址', '发件箱授权码', '收件箱地址', 主题 environment, 正文 mailMsg);
    sendMail('发件箱地址', '发件箱授权码', '收件箱地址', environment, mailMsg);
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
