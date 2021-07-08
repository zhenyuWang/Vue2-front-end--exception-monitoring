'use strict';
const nodemailer = require('nodemailer');
function sendMail(from, fromPass, receivers, subject, msg) {
  const smtpTransport = nodemailer.createTransport({
    host: 'smtp.qq.email',
    service: 'qq',
    secureConnection: true, // use SSL
    secure: true,
    port: 465,
    auth: {
      user: from,
      pass: fromPass,
    },
  });

  smtpTransport.sendMail({
    // from    : '标题别名 <foobar@latelee.org>',
    from,
    // 收件人邮箱，多个邮箱地址间用英文逗号隔开
    to: receivers,
    // 邮件主题
    subject,
    // text : msg,
    html: msg,
  }, err => {
    if (err) {
      console.log('send mail error: ', err);
    }
  });
}
module.exports = sendMail;
