
import axios from 'axios'
// 获取浏览器信息
function getBrowserInfo() {
  const agent = navigator.userAgent.toLowerCase();
  const regIE = /msie [\d.]+;/gi;
  const regIE11 = /rv:[\d.]+/gi;
  const regFireFox = /firefox\/[\d.]+/gi
  const regQQ = /qqbrowser\/[\d.]+/gi;
  const regEdg = /edg\/[\d.]+/gi;
  const regSafari = /safari\/[\d.]+/gi;
  const regChrome = /chrome\/[\d.]+/gi;
  // IE10及以下
  if (regIE.test(agent)) {
    return agent.match(regIE)[0];
  }
  // IE11
  if (regIE11.test(agent)) {
    return 'IE11';
  }
  // firefox
  if (regFireFox.test(agent)) {
    return agent.match(regFireFox)[0];
  }
  // QQ
  if (regQQ.test(agent)) {
    return agent.match(regQQ)[0];
  }
  // Edg
  if (regEdg.test(agent)) {
    return agent.match(regEdg)[0];
  }
  // Chrome
  if (regChrome.test(agent)) {
    return agent.match(regChrome)[0];
  }
  // Safari
  if (regSafari.test(agent)) {
    return agent.match(regSafari)[0];
  }
}
const handleError = Vue => {
  // vue 捕获错误钩子函数
  Vue.config.errorHandler = (err, vm) => {
    let environment = '';
    // 获取环境信息
    if (process.env.NODE_ENV === "production") {
      environment = '生产环境'
    }
    // 开发环境抛出Error
    if (!environment) {
      throw Error(err);
    }
    /* 
      上送报错信息
      这里可以定制任何信息,比如用户信息,用户点击历史记录,用户路由历史记录等
    */
    axios({
      method: 'post',
      url: `${process.env.VUE_APP_MONITOR_BASE_API}/mointor/reportError`,
      data: {
        environment,
        location: window.location.href,
        message: err.message,
        stack: err.stack,
        component: vm.$vnode.tag,
        browserInfo: getBrowserInfo()
      }
    });
  }
}
export { handleError }