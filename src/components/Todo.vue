<template>
	<li class="todo-li"  
      :class="{completed: todo.completed,editing:editedTodo}" >
      <!--todo视图-->
      <section class="view">
        <div class="left-wrap">
          <input type="checkbox" 
                 :checked="todo.completed"
                 @change="toggleTodo({ todo })"
                 class="state-toggle" />
        </div>
        <div class="right-wrap">
          <label @dblclick="editTodo">{{todo.task}}</label>
          <button @click="removeTodo({ todo })" class="destory" ></button>
        </div>
      </section>
      <!--todo编辑框-->
      <input type="text" 
             class="edit"
             :value="todo.task"
             v-todo-focus="editedTodo" 
             @blur="doneEdit" 
             @keyup.enter="doneEdit"
             ref="editInput"
             @input="checkEdit"
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
  watch: {
    todos: {
      handler: function (val, oldVal) {
        // 移除数据时 要相应地判断数据是否存在 再移除警告框
        var elm = this.$refs.editInput;
        this.checkEdit(elm);
      },
      deep: true
    }
  },
  computed: {
    todos () {
        return this.$store.state.todos;
    }
  },
	methods: {
      ...mapMutations([
        'toggleTodo',
        'removeTodo'
      ]),
      _validateEdit (task) {
        // 判断编辑任务内容是否重复
        var existTodo = this.$store.state.todos.filter((val) => {
            if (val !== this.todo) {
              return val.task === task;
            }
            return false;
        });
        return !existTodo.length > 0;
      },
      checkEdit (e) {
        var elm = e.target || e;
        var task = elm.value.trim();
        if (!this._validateEdit(task)) {
            elm.style.boxShadow = 'inset 0 0 6px 0 rgba(255,0,0,0.8)';
            return;
        }
        elm.style.boxShadow = 'inset 0 0 5px 0 rgba(0,0,0,0.2)';
      },
      editTodo () {
          this.$el.style = 'height: 100%';
          // 若任务已完成 那么不能编辑
          if (this.todo.completed) return;
          this.editedTodo = true;
      },
      doneEdit (e) {
          var todo = this.todo;
          // editedTodo非false判断，失去焦点时其值为false
          if (!this.editedTodo) return;
          var task = e.target.value.trim();
          // 若任务内容为空格或空串，那么移除该任务项
          if (!task) {
              this.removeTodo({todo});
              this.editedTodo = false;
              return;
          }
          if (!this._validateEdit(task)) {
              e.target.style.boxShadow = 'inset 0 0 6px 0 rgba(255,0,0,0.8)';
              return;
          }
          e.target.style.boxShadow = 'inset 0 0 5px 0 rgba(0,0,0,0.2)';
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

<style lang="less">
.todo-li{
  position: relative;
  display: flex;
  font-size: 1.6em;
  border-bottom: 1px solid #DDD;
  overflow: hidden;
  &.completed .view .right-wrap label{
    text-decoration: line-through;
    color: #D9D9D9;
  }
  &.editing {
    .view{
      display: none;
    }
    .edit{
      display: block;
      width: 100%;
      margin: 0 0 0 43px;
      padding: 7px 17px 10px;
      box-sizing: border-box;
      line-height: 1.4em;
      font-size: 1.2em;
      background: #C7EDCC;
      box-shadow: inset 0 0 5px 0 rgba(0, 0, 0, 0.2);
      outline: none;
      border: none;
    }
  }
  .view {
    display: flex;
    width: 100%;
    &:hover .right-wrap .destory{
      display: block;
      outline: none;
    }
    .left-wrap{
      flex: 0 0 65px;
      width: 65px;
      height: 56px;
      .state-toggle{
        position: absolute;
        top: 0px;
        bottom: 0px;
        width: 65px;
        height: 56px;
        margin: auto 0;
        appearance: none;
        outline: none;
        &:after{
          content: url('data:image/svg+xml;utf8,<svg xmlns ="http://www.w3.org/2000/svg" width="65" height="65" viewBox="-25 -35 130 160"><circle cx="33" cy="33" r="40" fill="none" stroke="#ededed" stroke-width="5"/></svg>');
        }
        &:checked:after{
          content: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="65" height="65" viewBox="-25 -35 130 160"><circle cx="33" cy="33" r="40" fill="none" stroke="#bddad5" stroke-width="3"/><path fill="#5dc2af" d="M57 10L27 56 12 41l-4 4 20 20 34-52z"/></svg>')
        }
      }
    }
    .right-wrap{
      flex: 1;
      label{
        display: inline-block;
        width: 100%;
        padding: 15px 50px 15px 0px;
        line-height: 26px;
        box-sizing: border-box;
        word-break: break-all;
        white-space: pre-line;
        transition: color 0.4s;
      }
      .destory{
        position: absolute;
        top: 0px;
        bottom: 0px;
        right: 0px;
        display: none;
        width: 50px;
        height: 56px;
        margin: auto 0;
        font-size: 1.3em;
        color: #cc9a9a;
        transition: color 0.2s ease-out;
        &:after{
          content: 'X';
        }
        &:hover{
          color: #af5b5e;
        }
      }
    }
  }
  .edit{
    display: none;
  }
}
</style>
