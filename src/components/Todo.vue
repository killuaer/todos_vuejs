<template>
	<li  class="todo-li"  
         :class="{completed: todo.completed,editing:editedTodo}" >
      <!--todo视图-->
      <section class="view">
        <input type="checkbox" 
               :checked="todo.completed"
               @change="toggleTodo({ 'todo': todo })"
               class="state-toggle" />
        <label @dblclick="editTodo(todo)">{{todo.task}}</label>
        <button @click="removeTodo({ 'todo': todo })" class="destory" ></button>
      </section>
      <!--todo编辑框-->
      <input type="text" 
             class="edit" 
             v-todo-focus="editedTodo" 
             v-model="editedInput" 
             @blur="doneEdit(todo)" 
             @keyup.enter="doneEdit(todo)" 
             @keyup.esc="cancelEdit(todo)" />
    </li>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
	name: 'todo',
	props: ['todo'],
	data:function(){
		return {
			 editedTodo: false,
			 // 缓存任务编辑框的值，不直接修改todo.task，避免触发ul更新，导致编辑框失去焦点
       editedInput: ''
		}
	},
	methods:{
      ...mapMutations([
        'toggleTodo',
        'removeTodo'
      ]),
      editTodo: function(todo){
          // 若任务已完成 那么不能编辑
          if(todo.completed) return;
          this.editedInput = todo.task;
          this.beforeEditCache = todo.task;
          this.editedTodo = true;
      },
      doneEdit: function(todo){
          // editedTodo非空判断，失去焦点时可能为null
          if(!this.editedTodo) return;
          var task = this.editedInput.trim();
          // 若任务内容为空格或空串，那么移除该任务项
          if(!task){ 
            this.removeTodo({ 'todo': todo }); 
            this.editedTodo = false;
            this.editedInput = null;
            this.beforeEditCache = null;
            return;
          } 
          // 获取任务内容相同的数组
          var existTodo = this.$store.state.todos.filter(function(val){
                                return val.task === task;
                            });           
          // 若数量大于0，就说明有重复内容，撤销修改
          if(existTodo.length>0){ 
             this.cancelEdit(todo);
             return;
          }
          // 不是上述情况时，保存任务编辑内容
          this.$store.commit('doneEdit',{ 'todo':todo,'task': this.editedInput});
          this.editedTodo = false;
          this.editedInput = null;
          this.beforeEditCache = null;

      },
      cancelEdit: function(todo){
          // 它只是隐藏了编辑框，并没有失去焦点，故它还会调用一次 doneEdit 方法
          this.editedInput = null;
          this.editedTodo = false;
          this.beforeEditCache = null;
      }
	},
    directives:{
       'todo-focus': function(el,binding){
          if(binding.value){
            el.focus();
            // 移动光标至文本末尾
            if(el.selectionStart===0){
               el.selectionStart = el.value.length;
            }
          }
        }
    }
}

</script>


