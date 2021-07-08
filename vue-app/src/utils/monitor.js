
import axios from 'axios'
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
  Vue.config.errorHandler = (err, vm) => {
    let environment = '';
    console.log('process.env.NODE_ENV', process.env.NODE_ENV);
    if (process.env.NODE_ENV === "production") {
      environment = '生产环境'
    }
    if (!environment) {
      throw Error(err);
    }
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