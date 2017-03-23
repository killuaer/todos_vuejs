<template>
  <div id="app">
    <h2>一个简单的todos</h2>
    <input type="text" 
           class="todo-input" 
           v-model="newTodo" 
           @keyup.enter="addTodo" placeholder="请输入想添加的任务" />
    <ul class="todo-ul">
      <li class="todo-li" 
          v-for=" todo in todos "> 
          {{todo.title}} 
      </li>
    </ul>
  </div>
</template>

<script>
import WebStorage from './common/webStorage.js'
export default {
  name: 'app',
  data: function(){
     return {
        // 新增的任务
        newTodo: '',    
        // 任务列表，在实例的数据观测(data observer)阶段，它就会获取浏览器中存储的数据
        todos: WebStorage("todos-vuejs").fetch()
     }
  },
  watch: {
      // 当todos数据变化时，存储数据到浏览器中，这个变化不包括任务对象上的变化，只检测任务数组的变化
      todos: function(todos){
          WebStorage("todos-vuejs").save(todos)
      }
  },
  methods: {
      addTodo: function(){
          // 判断新增任务是否为空串或非空白符
          var todo = this.newTodo.trim();

          // todo一定是字符串类型，不存在0、null、false和undefined的情况，所以它一定是空串判断
          if(!todo) { this.newTodo = ''; return; }
         
          // 判断新增任务是否已经存在，数组的some方法，有一个为true，那么就返回true
          var existTodo =  this.todos.some(function(val){
                               return val.title === todo;
                           })
                           
          if(existTodo) { return; }
          this.todos.push({ title: todo });
          this.newTodo = '';
      }
  }
}
</script>

<style>
h2 { font-size: 2em }
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin: 30px 10%;
}
.todo-input{
  width: 100%;
  font-size: 1.8em;
  padding: 10px 30px;
  box-sizing: border-box;
}
.todo-ul{
  list-style: none;
  padding: 0px;
  margin: 0px;
  border: 1px solid #DDD;
  border-top: 0px;
  border-bottom: 0px;
}
.todo-li{
  font-size: 1.6em;
  border-bottom: 1px solid #DDD;
  padding: 10px 30px;
}
</style>
