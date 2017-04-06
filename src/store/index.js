import Vue from 'vue';
import Vuex from 'vuex';
import { mutations } from './mutations';
import * as getters from './getter'
import WebStorage from '../common/webStorage'

Vue.use(Vuex);

const STORAGE_KEY = 'todos-vuejs';
const storage = WebStorage(STORAGE_KEY);

// 定义要管理的数据
const state = {
	todos: storage.fetch(),
	visibility: ''
};
// 自定义插件
const myPlugin = function(store) {
	return store.subscribe(function(mutations,state) {
		storage.save(state.todos);
	});
}

export default new Vuex.Store({
	state,
	mutations,
	getters,
	plugins: [myPlugin]
});


