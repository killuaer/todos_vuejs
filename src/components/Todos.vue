<template>
  <section id="todosApp">
    <!--todos头部-->
    <header class="header">
      <h2>todos</h2>
      <input type="checkbox" 
             v-model="allDone" 
             class="todoState-all" 
             v-show="todos.length" />
      <input type="text" 
             class="todo-input" 
             v-model="newTodo" 
             @keyup.enter="addTodo" placeholder="请输入想添加的任务" />
    </header>

    <!--todos主体-->
    <section class="main">
      <!--过渡组件-->
      <transition-group
        class="todo-ul"
        tag="ul"
        v-bind:css="false"
        v-on:before-enter="beforeEnter"
        v-on:enter="enter"
        v-on:leave="leave"
      >
        <li  class="todo-li" 
             v-for=" (todo,index) in filteredTodos " 
             :class="{completed: todo.completed,editing: todo == editedTodo}" 
             :key="todo.title+visibility"
             :data-index="index">
          <!--todo视图-->
          <section class="view">
            <input type="checkbox" 
                   v-model="todo.completed" 
                   class="state-toggle" />
            <label @dblclick="editTodo(todo)">{{todo.title}}</label>
            <button @click="removeTodo(todo)" class="destory" ></button>
          </section>
          <!--todo编辑框-->
          <input type="text" 
                 class="edit" 
                 v-todo-focus="todo == editedTodo" 
                 v-model="editedInput" 
                 @blur="doneEdit(todo)" 
                 @keyup.enter="doneEdit(todo)" 
                 @keyup.esc="cancelEdit(todo)" />
        </li>
      </transition-group>
    </section>

    <!--todos底部-->
    <footer class="footer" v-show="todos.length">
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
              v-show="todos.length > remaining "
              @click="removeCompleted">移除已完成任务</button>
    </footer>

  </section>
</template>

<script>
import WebStorage from '../common/webStorage.js'
import Velocity from 'velocity-animate'

// 根据不同的过滤项返回不同的过滤方法
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
        newTodo: '',   
        todos: WebStorage("todos-vuejs").fetch(),   
        visibility: this.$route.params.visibility,
        editedTodo: null,
        // 缓存任务编辑框的值，不直接修改todo.title，避免触发ul更新，导致编辑框失去焦点
        editedInput: ''
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
      // 检测通过router-link 提交的路由变化,并获取过滤选项值
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
         // 判断地址栏输入的链接是否符合过滤规则，不符合就返回全部任务内容
           this.visibility = ['all','active','completed'].indexOf(this.visibility)>0?this.visibility : 'all';
          return filters[this.visibility](this.todos);
      },
      remaining: function(){
         // 返回未完成任务的数量 
          return filters.active(this.todos).length
      }
  },
  methods: {
      addTodo: function(){
          // 判断新增任务是否为空串
          var todo = this.newTodo.trim();
          if(!todo) { this.newTodo = ''; return; }
          // 判断新增任务是否已经存在
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
          // 从数组中移除
          this.todos.splice(index,1);
      },
      removeCompleted: function(){
          this.todos = filters.active(this.todos)
      },
      editTodo: function(todo){
          // 若任务已完成 那么不能编辑
          if(todo.completed) return;
          this.editedInput = todo.title;
          this.beforeEditCache = todo.title;
          this.editedTodo = todo;
      },
      doneEdit: function(todo){
          // editedTodo非空判断，失去焦点时可能为null
          if(!this.editedTodo) return;
          var title = this.editedInput.trim();
          // 若任务内容为空格或空串，那么移除该任务项
          if(!title){ 
            this.removeTodo(todo); 
            this.editedTodo = null;
            this.editedInput = null;
            this.beforeEditCache = null;
            return;
          } 
          // 获取任务内容相同的数组
          var existTodo = this.todos.filter(function(val){
                                return val.title === title;
                            });           
          // 若数量大于0，就说明有重复内容，撤销修改
          if(existTodo.length>0){ 
             this.cancelEdit(todo);
             return;
          }
          // 不是上述情况时，保存任务编辑内容
          todo.title = this.editedInput;
          this.editedTodo = null;
          this.editedInput = null;
          this.beforeEditCache = null;
      },
      cancelEdit: function(todo){
          // 它只是隐藏了编辑框，并没有失去焦点，故它还会调用一次 doneEdit 方法
          todo.title = this.beforeEditCache
          this.editedInput = null;
          this.editedTodo = null;
          this.beforeEditCache = null;
      },
      beforeEnter: function (el) {
        el.style.opacity = 0
        el.style.height = 0
        el.style.border = 0
      },
      enter: function (el, done) {
       // 获取li上data-index的值，延迟执行过渡效果
       var delay = el.dataset.index * 80
       // 获取任务内容自适应后的高度
       var elHeight =el.getElementsByTagName("label")[0].clientHeight
       el.style.borderBottom = '1px solid #DDD'
        setTimeout(function () {
          Velocity(
            el,
            { opacity: 1, height: elHeight},
            { complete: done }
          )
        }, delay)
      },
      leave: function (el, done) {
        var delay = el.dataset.index * 80
        setTimeout(function () {
          Velocity(
            el,
            { opacity: 0, height: 0},
            { complete: done }
          )
        }, delay)
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

<style>
/* 全局样式 */
button{
  border: 0px;
  background: none;
}
a {
  text-decoration: none;
  color: #777;
  padding: 5px;
}
body {
  font: 14px 'Helvetica Neue', Helvetica, Arial, sans-serif;
  line-height: 1.4em;
  background: #f5f5f5;
  color: #4d4d4d;
  min-width: 230px;
  max-width: 550px;
  margin: 0 auto;
  font-weight: 300;
}
/* 新增任务框中占位文字的样式 */
#todosApp input::-webkit-input-placeholder {
  font-style: italic;
  font-weight: 300;
  color: #c6c6c6;
}
#todosApp input::-moz-placeholder {
  font-style: italic;
  font-weight: 300;
  color: #c6c6c6;
}
#todosApp input::input-placeholder {
  font-style: italic;
  font-weight: 300;
  color: #c6c6c6;
}

#todosApp {
  background: #fff;
  margin: 130px 0 40px 0;
  position: relative;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2),
              0 25px 50px 0 rgba(0, 0, 0, 0.1);
 
}
/* todos头部 */
#todosApp .header{
  position: relative;
  border: 1px solid #DDD;
}
#todosApp .header h2 { 
  position: absolute;
  top: -155px;
  width: 100%;
  font-size: 100px;
  font-weight: 100;
  text-align: center;
  color: rgba(175, 47, 47, 0.15);

}
#todosApp .header .todoState-all{
  position: absolute;
  top: 0px;
  bottom: 0px;
  left: 25px;
  margin:auto; 
}
#todosApp .header .todo-input{
  padding: 16px 16px 16px 60px;
  border: none;
  background: rgba(0, 0, 0, 0.003);
  box-shadow: inset 0 -2px 1px rgba(0,0,0,0.03);
  font-size: 24px;
  font-family: inherit;
  line-height: 1.4em;
  width: 100%;
  box-sizing: border-box;
}

/* todos主体 */
#todosApp .main{
  position: relative;
  border: 1px solid #DDD;
  border-top: 0;
  border-bottom: 0;
}
#todosApp .main .todo-ul{
  list-style: none;
  padding: 0px;
  margin: 0px;
}
/* li相对定位 为里面的内容的绝对定位做参考 */
#todosApp .main .todo-ul .todo-li{
  font-size: 1.6em;
  border-bottom: 1px solid #DDD;
  position: relative;
  overflow: hidden;
}
/* 绝对定位并垂直水平居中 */
.todo-li .view .state-toggle{
  position: absolute;
  top: 0px;
  bottom: 0px;
  left: 25px;
  margin:auto; 
  height: auto;
}
/* 处理文字溢出和 margin占位 */
.todo-li .view label{
  word-break: break-all;
  white-space: pre-line;
  margin-left: 60px;
  padding: 15px 50px 15px 0px;
  line-height: 1.2;
  display: block;
  transition: color 0.4s;
}
.todo-li.completed .view label{
  text-decoration: line-through;
  color: #D9D9D9;
}
.todo-li .view .destory{
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
.todo-li .view .destory:hover{
  color: #af5b5e;
}
.todo-li .view .destory:after{
  content: '×';
}
.todo-li:hover .view .destory{
  display: block
}
.todo-li .edit{
  display: none;
}
.todo-li.editing .view{
  display: none;
}
.todo-li.editing .edit{
  margin: 0 0 0 43px;
  display: block;
  width: 506px;
  margin: 0 0 0 43px;
  box-sizing: border-box;
  padding: 7px 17px 10px;
  font-size: 1.2em;
  line-height: 1.4em;
  background: #C7EDCC;
  border: 1px solid #999;
  box-shadow: inset 0 -1px 5px 0 rgba(0, 0, 0, 0.2);
}

/* todos底部 */
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
  font-size: 0.8em;
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
  font-size: 0.8em
}
</style>
