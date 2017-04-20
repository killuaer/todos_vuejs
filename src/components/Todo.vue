<template>
	<li class="todo-li"  
      :class="{completed: todo.completed,editing:editedTodo}" >
      <!--todo视图-->
      <section class="view">
        <input type="checkbox" 
               :checked="todo.completed"
               @change="toggleTodo({ todo })"
               class="state-toggle" />
        <label @dblclick="editTodo">{{todo.task}}</label>
        <button @click="removeTodo({ todo })" class="destory" ></button>
      </section>
      <!--todo编辑框-->
      <input type="text" 
             class="edit"
             :value="todo.task"
             v-todo-focus="editedTodo" 
             @blur="doneEdit" 
             @keyup.enter="doneEdit" 
             @keyup.esc="cancelEdit" />
    </li>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
	name: 'todo',
	props: ['todo'],
	data () {
		return {
			 editedTodo: false
		};
	},
	methods: {
      ...mapMutations([
        'toggleTodo',
        'removeTodo'
      ]),
      editTodo () {
          this.$el.style = 'height: 100%';
          // 若任务已完成 那么不能编辑
          if (this.todo.completed) return;
          this.editedTodo = true;
      },
      doneEdit (e) {
          var todo = this.todo;
          // editedTodo非false判断，失去焦点时可能为null
          if (!this.editedTodo) return;
          var task = e.target.value.trim();
          // 若任务内容为空格或空串，那么移除该任务项
          if (!task) {
              this.removeTodo({todo});
              this.editedTodo = false;
              return;
          }
          // 获取任务内容相同的数组
          var existTodo = this.$store.state.todos.filter((val) => val.task === task);

          // 若数量大于0，就说明有重复内容，撤销修改
          if (existTodo.length > 0) {
               this.cancelEdit(todo);
               return;
          }
          // 不是上述情况时，保存任务编辑内容
          this.$store.commit('doneEdit', {todo, task});
          this.editedTodo = false;
      },
      cancelEdit () {
          // 它只是隐藏了编辑框，并没有失去焦点，故它还会调用一次 doneEdit 方法
          this.editedTodo = false;
      }
	},
  directives: {
     'todo-focus' (el, {value}) {
        if (value) {
          el.focus();
          // 移动光标至文本末尾
          if (el.selectionStart === 0) {
             el.selectionStart = el.value.length;
          }
        }
      }
  }
};
</script>
