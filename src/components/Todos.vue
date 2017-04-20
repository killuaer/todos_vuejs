<template>
  <section id="todosApp">
    <!--todos头部-->
    <header class="header">
      <h2>todos</h2>
      <input type="checkbox" 
             :checked="allChecked"
             @change="toggleAll({ completed: !allChecked })"
             class="todoState-all" 
             v-show="todos.length" />
      <input type="text" 
             class="todo-input"
             autofocus
             autocomplete="off"   
             @keyup.enter="addTodo" 
             placeholder="请输入想添加的任务" />
    </header>

    <!--todos主体-->
    <section class="main">
      <!--过渡组件-->
      <transition-group class="todo-ul"
                        tag="ul"
                        :css="false"
                        @before-enter="beforeEnter"
                        @enter="enter"
                        @leave="leave"
                      >
        <todo v-for=" todo in filteredTodos " 
              :todo="todo" 
              :key="todo.task" ></todo>
      </transition-group>
    </section>

    <!--todos底部-->
    <footer class="footer" v-show="todos.length">
      <span class="todo-count">{{remaining}}个任务未完成</span>
      <ul class="filters">
        <li v-for=" (value,key) in options " >
          <router-link :to="'/todos/'+key" 
            :class="{selected: visibility == key}">
               {{value}}
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
import Velocity from 'velocity-animate';
import Todo from './Todo.vue';
import { mapMutations } from 'vuex';

// 过滤选项
let options = {'all': '全部', 'active': '未完成', 'completed': '已完成'};

export default {
  name: 'todosApp',
  data () {
     return {
        options
     };
  },
  components: {
      Todo
  },
  watch: {
      // 检测通过router-link 提交的路由变化,并获取过滤选项值
      $route ({ params }, from) {
          this.changeVisibility({'visibility': params.visibility});
      }
  },
  created () {
      // 判断地址栏输入的链接是否符合过滤规则，不符合就返回全部任务内容
      let visibility = this.$route.params.visibility;

      visibility = Object.keys(this.options).indexOf(visibility) > 0 ? visibility : 'all';

      this.changeVisibility({visibility});
  },
  computed: {
      todos () {
          return this.$store.state.todos;
      },
      visibility () {
          return this.$store.state.visibility;
      },
      allChecked () {
          // 只要有一个任务没有完成那么就返回false,即全选框不勾上
          return this.todos.every((todo) => todo.completed);
      },
      filteredTodos () {
          return this.$store.getters.filteredTodos;
      },
      remaining () {
          // 返回未完成任务的数量
          return this.$store.getters.remaining;
      }
  },
  methods: {
      addTodo (e) {
          // 判断新增任务是否为空串
          var task = e.target.value.trim();
          if (!task) {
            e.target.value = '';
            return;
          }
          // 判断新增任务是否已经存在
          var existTodo = this.todos.some((val) => val.task === task);
          if (existTodo) return;

          this.$store.commit('addTodo', {task});
          e.target.value = '';
      },
      beforeEnter (el) {
          el.style.opacity = 0;
          el.style.height = 0;
      },
      enter (el, done) {
          var delay = 100;
          // 获取任务内容自适应后的高度
          var elHeight = el.getElementsByTagName('label')[0].clientHeight;
          setTimeout(() => {
            Velocity(
              el,
              {opacity: 1, height: elHeight},
              {complete: done}
            );
          }, delay);
      },
      leave (el, done) {
          var delay = 100;
          setTimeout(() => {
            Velocity(
              el,
              {opacity: 0, height: 0},
              {complete: done}
            );
          }, delay);
      },
      ...mapMutations([
        'toggleAll',
        'removeCompleted',
        'changeVisibility'
      ])
  }
};
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
  content: 'X';
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
  height: 16px;
  color: #777;
  padding: 10px 20px;
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
