// 根据不同的过滤项返回不同的过滤方法
const filters = {
  all: function (todos){
      return todos;
  },
  active: function (todos){
      return todos.filter(function(todo){
          return !todo.completed; 
      });
  },
  completed: function (todos){
      return todos.filter(function(todo){
          return todo.completed;                
      });
  }
};


export const filteredTodos = function (state) {
	return filters[state.visibility](state.todos);
};

export const remaining = function (state) {
	return filters.active(state.todos).length;
};

