// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'

/* eslint-disable no-new */
// 新建vue.js实例,替换index.html中#app的元素为<App />,再加载组件App
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
})
