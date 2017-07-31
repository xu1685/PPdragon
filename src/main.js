import Vue from 'vue'
import axios from 'axios'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import vueCropper from 'vue-cropper'

import VueRouter from 'vue-router'
import routerConfig from './router'

Vue.use(ElementUI);
Vue.use(VueRouter);

const router = new VueRouter(routerConfig);

axios.get('/api/pc/book_list')
  .then(function (response) {
    console.log('response',response);
  })
  .catch(function (error) {
    console.log(error);
  });

Vue.prototype.$http = axios// 将axios绑定到vue上



new Vue({
  router,
  el: '#app',
  render: h => h(App),
})

