// 根据不同的过滤项返回不同的过滤方法
const filters = {
  all (todos) {
  	return todos;
  },
  active (todos) {
  	return todos.filter(todo => !todo.completed);
  },
  completed (todos) {
  	return todos.filter(todo => todo.completed);
  }
};
// 获取过滤后的任务列表
export const filteredTodos = ({todos, visibility}) => filters[visibility](todos);
// 获取未完成任务数量
export const remaining = ({todos}) => filters.active(todos).length;

