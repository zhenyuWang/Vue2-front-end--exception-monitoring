
import axios from 'axios'
const handleError = Vue => {
  Vue.config.errorHandler = (err, vm) => {
    axios({
      method: 'post',
      url: 'http://127.0.0.1:7001/mointor/reportError',
      data: {
        location: window.location.href,
        message: err.message,
        stack: err.stack,
        component: vm.$vnode.tag
      }
    });
  }
}
export { handleError }