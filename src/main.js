// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import VueRouter from 'vue-router';

import App from './App.vue';
import routes from './config/routes.js';

Vue.use(VueRouter);
const router = new VueRouter({
	routes,
	mode: 'history'
});

/* eslint-disable no-new */
new Vue({
  router,
  el: '#app',
  render:(h) => h(App)
})
