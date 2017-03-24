// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import VueRouter from 'vue-router';

import App from './App.vue';
import routes from './config/routes.js';

// 全局应用路由功能
Vue.use(VueRouter);
// 路由配置
const router = new VueRouter({
	routes,
	mode: 'history'
});


// 应用路由配置到vue实例上
new Vue({
  router,
  el: '#app',
  render:(h) => h(App)
})
