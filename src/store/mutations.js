import * as types from './mutation-types'

export const mutations = {
	[types.ADDTODO]: function(state,obj) {
		state.todos.push({
			task: obj.task,
			completed: false
		});
	},
	[types.REMOVETODO]: function(state,obj){
		state.todos.splice(state.todos.indexOf(obj.todo),1);
	},
	[types.REMOVECOMPLETED]: function(state){
		state.todos = state.todos.filter(function(todo){
			return !todo.completed;
		});
	},
	[types.DONEEDIT]: function(state,obj){
		obj.todo.task = obj.task;
	},
	[types.TOGGLETODO]: function(state,obj){
		obj.todo.completed = !obj.todo.completed;
	},
	[types.TOGGLEALL]: function(state,obj){
		state.todos.forEach(function(todo){
			todo.completed = obj.completed;
		});
	},
	[types.CHANGEVISIBILITY]: function(state,obj){
		state.visibility = obj.visibility;
	}
};

