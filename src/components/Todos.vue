<template>
  <div id="app">
    <h2>一个简单的todos</h2>
    <div class="headView">
      <input type="checkbox" v-model="allDone" class="todoState-all" v-show="todos.length" />
      <input type="text" class="todo-input" v-model="newTodo" @keyup.enter="addTodo" placeholder="请输入想添加的任务" />
    </div>
    <ul class="todo-ul">
      <li class="todo-li" v-for=" (todo,index) in filteredTodos " :class="{completed: todo.completed}" :key="index" >
        <input type="checkbox" v-model="todo.completed" :id="'todoState'+index" class="state-toggle" />
        <label :for="'todoState'+index">{{todo.title}}</label>
        <button @click="removeTodo(todo)" class="destory" ></button>
      </li>
    </ul>
    <div class="footer" v-show="todos.length">
      <ul class="filters">
        <router-link to="/todos/all" tag="li" :class="{selected: visibility=='all'}">
          全部
        </router-link>
        <router-link to="/todos/active" tag="li" :class="{selected: visibility=='active'}">
          未完成
        </router-link>
        <router-link to="/todos/completed" tag="li" :class="{selected: visibility=='completed'}">
          已完成
        </router-link>
      </ul>
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
        visibility: this.$route.params.visibility
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
              var num = this.todos.filter(function(todo){
                                return !todo.completed
                        }).length;
              return num === 0;
          },
          set: function(state){
              this.todos.forEach(function(todo){
                  todo.completed = state;
              });
          }
      },
      filteredTodos: function(){
          return filters[this.visibility](this.todos);
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
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin: 30px 20%;
  width: auto;
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

.footer{
  position: relative;
  border:1px solid #DDD;
  text-align: center;
  margin-right:-2px;
  color: #777
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
  display: inline;
  padding: 5px;
  font-size: 0.7em;
  cursor: pointer;
}
.footer ul.filters li.selected{
  border: 1px solid rgba(175, 47, 47, 0.3);
  border-radius: 8px;
}

</style>