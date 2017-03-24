<template>
  <div id="app">
    <h2>一个简单的todos</h2>
    <div class="headView">
      <input type="checkbox" 
             v-model="allDone" 
             class="todoState-all" 
             v-show="todos.length" />
      <input type="text" 
             class="todo-input" 
             v-model="newTodo" 
             @keyup.enter="addTodo" 
             placeholder="请输入想添加的任务" />
    </div>
    <ul class="todo-ul">
      <li class="todo-li"
          v-for=" (todo,index) in filteredTodos " 
          :class="{completed: todo.completed,editing: todo == editedTodo}"
          :key="index" >
        <div class="view">
          <input type="checkbox"
                 v-model="todo.completed"
                 class="state-toggle" />
          <label @dblclick="editTodo(todo)">{{todo.title}}</label>
          <button @click="removeTodo(todo)" class="destory" ></button>
        </div>
        <input type="text" 
               class="edit" 
               v-todo-focus="todo == editedTodo" 
               v-model="todo.title" 
               @blur="doneEdit(todo)" 
               @keyup.enter="doneEdit(todo)" 
               @keyup.esc="cancelEdit(todo)" />
      </li>
    </ul>
    <div class="footer" v-show="todos.length">
      <span class="todo-count">{{remaining}}个任务未完成</span>
      <ul class="filters">
        <li>
          <router-link to="/todos/all" 
              :class="{selected: visibility=='all'}">
               全部
          </router-link> 
        </li>
        <li>
          <router-link to="/todos/active" 
            :class="{selected: visibility=='active'}">
               未完成
          </router-link>
        </li>
        <li>
          <router-link to="/todos/completed"  
            :class="{selected: visibility=='completed'}">
               已完成
          </router-link>
        </li>
      </ul>
      <button class="clear-completed" 
              v-show="todos.length > remaining" 
              @click="removeCompleted">移除已完成任务</button>
    </div>
  </div>
</template>

<script>
import WebStorage from '../common/webStorage.js'

// 根据不同的过滤值返回不同的过滤方法
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
  name: 'todosApp',
  data: function(){
     return {
        // 新增的任务
        newTodo: '',    
        // 任务列表，在实例的数据观测(data observer)阶段，它就会获取浏览器中存储的数据
        todos: WebStorage("todos-vuejs").fetch(),
        // 保存过滤选项选中的值
        visibility: this.$route.params.visibility,
        editedTodo: null
     }
  },
  watch: {
      // 深层次观察todos内容的变化，包括任务对象(todo)上的变化，并及时存储数据
      todos: {
          handler: function (todos){
              WebStorage("todos-vuejs").save(todos)
          },
          deep: true
      },
      // 检测通过router-link提交的路由变化
      $route (to, from) {
          this.visibility = to.params.visibility;
      }
     
  },
  computed: {
      allDone: {
          // 若未完成数量为0，那么全选框选中(true)，否则不选中(false)
          get: function(){
              return this.remaining === 0;
          },
          // 根据全选框的值，对所有任务状态进行统一修改
          set: function(state){
              this.todos.forEach(function(todo){
                  todo.completed = state;
              });
          }
      },
      filteredTodos: function(){
          // 判断地址栏输入的链接是否符合过滤规则，不符合就返回全部任务内容
          this.visibility = ['all','active','completed'].indexOf(this.visibility)>0?this.visibility : 'all';
          // 获得过滤值，再获得相应的过滤方法，最后对传入的参数进行过滤
          return filters[this.visibility](this.todos);
      },
      remaining: function(){
          // 返回未完成任务的数量 
          return filters.active(this.todos).length
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

          this.todos.push({ title: todo, completed: false });
          this.newTodo = '';
      },
      removeTodo: function(todo){
          // 获取在任务列表中的位置
          var index = this.todos.indexOf(todo);
          // 从任务列表中移除
          this.todos.splice(index,1);
      },
      removeCompleted: function(){
          this.todos = filters.active(this.todos)
      },
      editTodo: function(todo){
          // 若任务已完成 那么不能编辑
          if(todo.completed) return;
          // 缓存原始任务内容
          this.beforeEditCache = todo.title;
          // 判定显示那个任务下的编辑框
          this.editedTodo = todo;
      },
      doneEdit: function(todo){
          // this.editedTodo = null 对于视图相当于隐藏任务编辑区
          var title = todo.title.trim();
          if(!title){ 
            this.removeTodo(todo); 
            this.editedTodo = null;
            return;
          } 
          // 获取任务内容相同的数组
          var existTodo = this.todos.filter(function(val){
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
          // 被绑定元素的value为true,那么该元素获得焦点
          if(binding.value){
              el.focus();
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
  margin: 30px 10%;
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
  border: 1px solid #DDD;
}
div.headView .todoState-all{
  position: absolute;
  top: 0px;
  bottom: 0px;
  left: 25px;
  margin:auto 0px; 
}
div.headView .todo-input{
  width: 100%;
  font-size: 1.8em;
  padding: 10px 20px 10px 60px;
  box-sizing: border-box;
  border: 0px;
  background: #FFF;
}

.todo-ul{
  list-style: none;
  padding: 0px;
  margin: 0px;
  border: 1px solid #DDD;
  border-top: 0px;
  border-bottom: 0px;
}
/* li相对定位 为里面的内容的绝对定位做参考 */
.todo-ul .todo-li{
  font-size: 1.6em;
  border-bottom: 1px solid #DDD;
  padding: 10px 0px;
  position: relative;
}
/* 绝对定位并垂直水平居中 */
.state-toggle{
  position: absolute;
  top: 0px;
  bottom: 0px;  
  left: 25px;
  margin:auto 0px; 
}
/* 处理文字溢出和 margin占位 */
.todo-ul .todo-li label{
  word-break: break-all;
  white-space: pre-line;
  margin-left: 60px;
  margin-right: 50px;
  display: block;
  transition: color 0.4s;
}
.todo-ul .todo-li.completed label{
  text-decoration: line-through;
  color: #D9D9D9;
}
.todo-ul .todo-li .destory{
  display: none;
  position: absolute;
  right: 10px;
  top: 0px;
  bottom: 0px;
  width: 40px;
  font-size: 1.3em;
  color: #cc9a9a;
  transistion: color 0.2s ease-out
}
.todo-ul .todo-li:hover .destory{
  display: block
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
  margin-left: 50px;
  padding: 0px 10px;
  font-size: 1.2em;
  background: #C7EDCC;
}


.footer{
  position: relative;
  text-align: center;
  color: #777;
  padding: 10px 23px 32px;
  border: 1px solid #DDD;
}
.footer .todo-count {
  position: absolute;
  left: 25px;
  font-size: 0.8em;
}

.footer ul.filters {
  position: absolute; 
  left: 0px;
  right: 0px;
  padding: 0px;
  margin: auto;
  list-style: none;
}
.footer ul.filters li{
  display: inline-block;
  width: 50px;
  font-size: 0.7em;
  cursor: pointer;
}
ul.filters li a.selected,
ul.filters li:hover a.selected
{
  border: 1px solid rgba(175, 47, 47, 0.3);
  border-radius: 5px;
}
ul.filters li:hover a{
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
