import todos from '../components/Todos.vue';

// 匹配路径，默认返回全部任务内容，:visibility参数可以在 Todos.vue组件中通过this.$route.params.visibility获得
export default [
	{
		path:'/',
		redirect: '/todos/all'
	},	
	{
		path:'/todos/:visibility',
		component: todos
	}
]