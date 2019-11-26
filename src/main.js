import Vue from 'vue'
import App from './App.vue'
import fastClick from 'fastclick'
 
fastClick.attach(document.body)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
