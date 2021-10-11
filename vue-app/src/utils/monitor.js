
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
    // 本地开发环境抛出异常
    // if (process.env.NODE_ENV === "development") throw Error(err)
    let environment = '测试环境';
    // 获取环境信息
    if (process.env.VUE_APP_BASE_API === "生产环境地址") {
      environment = '生产环境'
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
        // 当前组件
        component: vm.$vnode.tag,
        // 浏览器信息
        browserInfo: getBrowserInfo(),
        // 以下信息可以放在vuex store中维护
        // 用户ID
        userId:'001',
        // 用户名称
        userName:'张三',
        // 路由记录
        routerHistory:[
          {
            fullPath:'/login',
            name:'Login',
            query:{},
            params:{},
          },{
            fullPath:'/home',
            name:'Home',
            query:{},
            params:{},
          }
        ],
        // 点击记录
        clickHistory:[
          {
            pageX:50,
            pageY:50,
            nodeName:'div',
            className:'test',
            id:'test',
            innerText:'测试按钮'
          }
        ],
      }
    });
  }
}
export { handleError }