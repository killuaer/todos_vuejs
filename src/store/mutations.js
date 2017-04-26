import * as types from './mutation-types';

export const mutations = {
	// 添加任务
	[types.ADDTODO] (state, {task}) {
		state.todos.push({ task, completed: false });
	},
	// 移除任务
	[types.REMOVETODO] (state, {todo}) {
		state.todos.splice(state.todos.indexOf(todo), 1);
	},
	// 移除已完成任务
	[types.REMOVECOMPLETED] (state) {
		state.todos = state.todos.filter((todo) => !todo.completed);
	},
	// 完成任务编辑
	[types.DONEEDIT] (state, {todo, task}) {
		todo.task = task;
	},
	// 修改某个任务的状态
	[types.TOGGLETODO] (state, {todo}) {
		todo.completed = !todo.completed;
	},
	// 任务全完成/未完成
	[types.TOGGLEALL] (state, {completed}) {
		state.todos.forEach((todo) => (todo.completed = completed));
	},
	// 改变路由选项
	[types.CHANGEVISIBILITY] (state, {visibility}) {
		state.visibility = visibility;
	}
};

