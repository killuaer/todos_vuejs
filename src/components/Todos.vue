<template>
  <div id="app">
    <h2>一个简单的todos</h2>
    <div class="headView">
      <input type="checkbox" v-model="allDone" class="todoState-all" v-show="todos.length" />
      <input type="text" class="todo-input" v-model="newTodo" @keyup.enter="addTodo" placeholder="请输入想添加的任务" />
    </div>
    <ul class="todo-ul">
      <li class="todo-li" v-for=" (todo,index) in filteredTodos " :class="{completed: todo.completed,editing: todo == editedTodo}" :key="index" >
        <div class="view">
          <input type="checkbox" v-model="todo.completed"  class="state-toggle" />
          <label @dblclick="editTodo(todo)">{{todo.title}}</label>
          <button @click="removeTodo(todo)" class="destory" ></button>
        </div>
        <input type="text" class="edit" v-todo-focus="todo == editedTodo" v-model="todo.title" @blur="doneEdit(todo)" @keyup.enter="doneEdit(todo)" @keyup.esc="cancelEdit(todo)" />
      </li>
    </ul>
    <div class="footer" v-show="todos.length">
      <span class="todo-count">{{remaining}}个任务未完成</span>
      <ul class="filters">
        <li>
          <router-link to="/todos/all"  :class="{selected: visibility=='all'}">
            全部
          </router-link> 
        </li>
        <li>
           <router-link to="/todos/active"   :class="{selected: visibility=='active'}">
            未完成
           </router-link>
        </li>
        <li>
           <router-link to="/todos/completed"   :class="{selected: visibility=='completed'}">
             已完成
           </router-link>
        </li>
      </ul>
      <button class="clear-completed" v-show="todos.length > remaining " @click="removeCompleted">移除已完成任务</button>
    </div>
  </div>
</template>

<script>
import WebStorage from '../common/webStorage.js'

var filters = {
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
}

export default {
  name: 'app',
  data: function(){
     return {
        newTodo: '',    //新增的任务项
        todos: WebStorage("todos-vuejs").fetch(),       //任务项列表
        visibility: this.$route.params.visibility,
        editedTodo: null
     }
  },
  watch: {
      // 深层次观察todos内容的变化，包括todo内容的变化
      todos: {
          handler: function (todos){
              WebStorage("todos-vuejs").save(todos)
          },
          deep: true
      },
      $route (to, from) {
          this.visibility = to.params.visibility;
      }
     
  },
  computed: {
      allDone: {
          get: function(){
              return this.remaining === 0;
          },
          set: function(state){
              this.todos.forEach(function(todo){
                  todo.completed = state;
              });
          }
      },
      filteredTodos: function(){
          return filters[this.visibility](this.todos);
      },
      remaining: function(){
          return filters.active(this.todos).length
      }
  },
  methods: {
      addTodo: function(){
          // 判断新增任务是否为空串
          var todo = this.newTodo && this.newTodo.trim();
          if(!todo) { return; }
          // 判断新增任务是否已经存在
          var existTodo =  Array.from(this.todos).some(function(val){
                                return val.title === todo;
                            })
          if(existTodo) { return; }
          this.todos.push({title: todo,completed: false});
          this.newTodo = '';
      },
      removeTodo: function(todo){
          // 获取在任务列表中的位置
          var index = this.todos.indexOf(todo);
          // 从数组中移除
          this.todos.splice(index,1);
      },
      removeCompleted: function(){
          this.todos = filters.active(this.todos)
      },
      editTodo: function(todo){
          // 若任务已完成 那么不能编辑
          if(todo.completed) return;
          this.beforeEditCache = todo.title;
          this.editedTodo = todo;
      },
      doneEdit: function(todo){
          var title = todo.title && todo.title.trim();
          if(!title){ 
            this.removeTodo(todo); 
            return;
          } 
          // 获取任务内容相同的数组
          var existTodo = Array.from(this.todos).filter(function(val){
                                return val.title === title;
                            });
          //数量若有一个以上，就说明有重复内容，撤销修改
          if(existTodo.length>1){ 
            this.cancelEdit(todo);
          }else{
            this.editedTodo = null;
          }
      },
      cancelEdit: function(todo){
          this.editedTodo = null;
          todo.title = this.beforeEditCache
      }
  },
  directives:{
      'todo-focus': function(el,binding){
          if(binding.value){
              el.focus();
              var a = el.value ;
                el.value = a;
          }
      }
  }
}
</script>

<style>
h2 { font-size: 2em }
button{
  border: 0px;
  background: none;
}
a {
  text-decoration: none;
  color: #777;
  padding: 5px;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin: 30px 20%;
  width: auto;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;

}
div.headView{
  position: relative;
}
div.headView .todoState-all{
  position: absolute;
  top: 0px;
  bottom: 0px;
  width: 60px;
  margin:auto 0px; 
}
.todo-input{
  width: 100%;
  height: 50px;
  font-size: 1.5em;
  text-indent: 2.2em;
  padding: 0px;
  border: 1px solid #DDD;
  border-bottom: 0px;
  background: #FFF;
}
.todo-ul{
  list-style: none;
  padding: 0px;
  margin: 0px;
  margin-right: -2px;
  border: 1px solid #DDD;
  border-bottom: 0px;
}
/* li相对定位 为里面的内容的绝对定位做参考 */
.todo-ul .todo-li{
  font-size: 1.6em;
  border-bottom: 1px solid #DDD;
  padding: 10px;
  position: relative;
}
/* 绝对定位并垂直水平居中 */
.state-toggle{
  position: absolute;
  top: 0px;
  bottom: 0px;
  width: 40px;
  margin:auto 0px; 
}
/* 处理文字溢出和 margin占位 */
.todo-ul .todo-li label{
  word-break: break-all;
  white-space: pre-line;
  margin-left: 45px;
  margin-right: 40px;
  display: block;
}
.todo-ul .todo-li.completed label{
  text-decoration: line-through;
  color: #D9D9D9;
}
.todo-ul .todo-li .destory{
  display: none;
  position: absolute;
  right: 0px;
  top: 0px;
  bottom: 0px;
  width: 40px;
  font-size: 1.3em;
  color: #cc9a9a;
  transistion: color 0.2s ease-out
}
.todo-ul .todo-li .destory:hover{
  color: #af5b5e;
}
.todo-ul .todo-li .destory:after{
  content: '×';
}
.todo-ul .todo-li:hover .destory{
  display: block
}
.todo-ul .todo-li.editing{
  padding: 0px;
}
.todo-ul .todo-li .edit{
  display: none;
}
.todo-ul .editing .view{
  display: none;
}
.todo-ul .editing .edit{
  display: block;
  height: 45px;
  margin-left: 45px;
  padding: 0px 10px;
  font-size: 1.2em;
  background: #C7EDCC;
}


.footer{
  position: relative;
  border:1px solid #DDD;
  text-align: center;
  margin-right:-2px;
  color: #777
}
.footer .todo-count {
  position:absolute;
  left:20px;
  font-size:0.7em;
  line-height: 3em;
}

.footer ul.filters {
  position: relative; 
  left: 0px;
  right: 0px;
  padding: 0px;
  margin: auto;
  line-height: 2em;
  list-style: none;
}
.footer ul.filters li{
  display: inline-block;
  width: 50px;
  font-size: 0.7em;
  cursor: pointer;
}
.footer ul.filters li a.selected{
  border: 1px solid rgba(175, 47, 47, 0.3);
  border-radius: 5px;
}
.footer ul.filters li:hover a{
  border: 1px solid rgba(175, 47, 47, 0.1);
  border-radius: 5px;
}
.footer .clear-completed {
  position: absolute;
  top: 0px;
  bottom: 0px;
  right: 5px;
  color: #777;
  font-size: 0.7em
}

</style>
