import todos from '../components/Todos.vue';

export default [
	{
		path: '/',
		redirect: '/todos/all'
	},
	{
		path: '/todos/:visibility',
		component: todos
	}
];
