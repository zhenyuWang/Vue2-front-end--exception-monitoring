import Vue from 'vue'
// 引入handleError
import { handleError } from './utils/monitor'
import App from './App.vue'

Vue.config.productionTip = false
// 使用handleError进行异常捕获并上传
handleError(Vue)


new Vue({
  render: h => h(App),
}).$mount('#app')
