import Vue from 'vue'
import { handleError } from './utils/monitor'
import App from './App.vue'

Vue.config.productionTip = false

handleError(Vue)


new Vue({
  render: h => h(App),
}).$mount('#app')
