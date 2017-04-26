<template>
  <section id="todosApp">
    <!--todos头部-->
    <header class="header">
      <h2>todos</h2>
      <div class="left-wrap">
        <input type="checkbox"
               :checked="allChecked"
               @change="toggleAll({ completed: !allChecked })"
               class="todoState-all" 
               v-show="todos.length" />
      </div>
      <div class="right-wrap">
        <input type="text" 
               class="todo-input"
               autofocus
               autocomplete="off"
               ref="todoInput"
               @keyup.enter="addTodo"
               @input="checkTodo"
               placeholder="请输入想添加的任务" />
      </div>
    </header>

    <!--todos主体-->
    <section class="main">
      <!--过渡组件-->
      <transition-group class="todo-ul"
                        ref="todoUl"
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
    <transition name="slide">
      <footer class="footer" v-show="todos.length">
          <div class="left-wrap">
             <span class="todo-count">{{remaining}}个未完成</span>
          </div>
          <div class="center-wrap">
            <ul class="filters">
              <li v-for=" (value,key) in options ">
                <router-link :to="'/todos/'+key" 
                  :class="{selected: visibility == key}">
                     {{value}}
                </router-link>
              </li>
            </ul>
          </div>
          <div class="right-wrap">
            <transition name="fade">
              <button class="clear-completed" 
                      v-show="todos.length > remaining "
                      @click="removeCompleted">移除已完成</button>
            </transition>
          </div>
      </footer>
    </transition>
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
        options,
        screenWidth: window.screen.availWidth
     };
  },
  components: {
      Todo
  },
  watch: {
      // 检测通过router-link 提交的路由变化,并获取过滤选项值
      $route ({ params }, from) {
          this.changeVisibility({'visibility': params.visibility});
      },
      todos: {
        handler: function (val, oldVal) {
          // 移除数据时 要相应地判断数据是否存在 再移除警告框
          var elm = this.$refs.todoInput;
          this.checkTodo(elm);
        },
        deep: true
      }
  },
  mounted () {
      // 挂载元素时，监听浏览器窗口大小的调整，然后当设备在横屏和竖屏之间切换时，重置任务列表的高度和margin-top
      window.onresize = () => {
        if (this.screenWidth !== window.screen.availWidth) {
          this.screenWidth = window.screen.availWidth;
          let childrenArr = this.$refs.todoUl.children;
          childrenArr.forEach((child) => {
            let elm = child.elm;
            elm.style.height = '100%';
            elm.getElementsByClassName('state-toggle')[0].style.marginTop = 'auto';
          });
        }
      };
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
      _validateTodo (task) {
        // 验证任务内容是否非空和重复
        return task && !this.todos.some((val) => val.task === task);
        // if (!task) {
        //   return false;
        // } else {
        //   // 判断新增任务是否已经存在
        //   var existTodo = this.todos.some((val) => val.task === task);
        //   return !existTodo;
        // }
      },
      checkTodo (e) {
        var elm = e.target || e;
        // 移除新增任务头部和尾部的空白字符
        var task = elm.value.trim();
        var flag = this._validateTodo(task);
        if (flag) {
          elm.style.boxShadow = 'none';
        } else {
          elm.style.boxShadow = ' 0 0 6px 0 rgba(255,0,0,0.8)';
          // 如果输入框没有值就清除红框标记
          !elm.value.length ? elm.style.boxShadow = 'none' : '';
        }
      },
      addTodo (e) {
          // 移除新增任务头部和尾部的空白字符
          var task = e.target.value.trim();
          var flag = this._validateTodo(task);
          if (!flag) return;
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

          // 为每个任务内容复选框计算赋值一个margin-top值，目的是更好的动画效果
          var checkbox = el.getElementsByClassName('state-toggle')[0];
          var cbHeight = checkbox.clientHeight;
          var cbMargintop = (elHeight - cbHeight) / 2;
          checkbox.style.marginTop = cbMargintop + 'px';

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
          // 同上
          var elHeight = el.getElementsByTagName('label')[0].clientHeight;

          var checkbox = el.getElementsByClassName('state-toggle')[0];
          var cbHeight = checkbox.clientHeight;
          var cbMargintop = (elHeight - cbHeight) / 2;
          checkbox.style.marginTop = cbMargintop + 'px';

          var destory = el.getElementsByClassName('destory')[0];
          var desHeight = destory.clientHeight;
          var desMargintop = (elHeight - desHeight) / 2;
          destory.style.marginTop = desMargintop + 'px';

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

<style lang="less">
/* 全局样式 */
body {
  min-width: 312px;
  padding: 0 15px;
  margin: 0;
  line-height: 1.4em;
  font-weight: 300;
  font: 14px 'Helvetica Neue', Helvetica, Arial, sans-serif;
  background: #f5f5f5;
  color: #4d4d4d;
  /*  禁止文字选中 */
  user-select:none;
  /*  去除移动端点击时的蓝色背景 */
  -webkit-tap-highlight-color: rgba(0,0,0,0);
  button{
    border: 0px;
    background: none;
  }
  a {
    padding: 5px;
    text-decoration: none;
    color: #777;
  }
  /* 新增任务框中占位文字的样式 */
  input::-webkit-input-placeholder {
    font-style: italic;
    font-weight: 300;
    color: #c6c6c6;
  }
  input::-moz-placeholder {
    font-style: italic;
    font-weight: 300;
    color: #c6c6c6;
  }
  input::input-placeholder {
    font-style: italic;
    font-weight: 300;
    color: #c6c6c6;
  }
}

@media (min-width: 576px) {
  body {
    padding-left: 50px;
    padding-right: 50px;
  }
}
@media (min-width: 768px) {
  body {
    padding-left: 100px;
    padding-right: 100px;
  }
}
@media (min-width: 992px) {
  body {
    padding-left: 150px;
    padding-right: 150px;
  }
}
@media (min-width: 1200px) {
  body {
    padding-left: 200px;
    padding-right: 200px;
  }
}

#todosApp {
  position: relative;
  margin-top: 120px;
  margin-bottom: 60px;
  margin-left: auto;
  margin-right: auto;
  background: #fff;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2),
              0 25px 50px 0 rgba(0, 0, 0, 0.1);

  /* todos头部 */
  .header{
    position: relative;
    display: flex;
    border: 1px solid #DDD;
    h2 {
      position: absolute;
      top: -180px;
      width: 100%;
      font-size: 85px;
      font-weight: 100;
      text-align: center;
      color: rgba(175, 47, 47, 0.15);
    }
    .left-wrap{
      flex: 0 0 65px;
      width: 65px;
      height: 65px;
      .todoState-all{
        width: 65px;
        height: 65px;
        margin: auto 0;
        appearance: none;
        outline: none;
        &::after{
          content: url('data:image/svg+xml;utf8,<svg xmlns ="http://www.w3.org/2000/svg" width="65" height="65" viewBox="-25 -45 130 160"><circle cx="33" cy="33" r="40" fill="none" stroke="#ededed" stroke-width="5"/></svg>');
        }
        &:checked:after{
          content: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="65" height="65" viewBox="-25 -45 130 160"><circle cx="33" cy="33" r="40" fill="none" stroke="#bddad5" stroke-width="3"/><path fill="#5dc2af" d="M57 10L27 56 12 41l-4 4 20 20 34-52z"/></svg>');
        }
      }
    }
    .right-wrap{
      flex: 1;
      .todo-input{
        width: 100%;
        padding: 16px 16px 16px 0px;
        line-height: 1.4em;
        box-sizing: border-box;
        font-size: 24px;
        font-family: inherit;
        background: rgba(0, 0, 0, 0.003);
        border: none;
        outline: none;
      }
    }
  }

  /* todos主体 */
  .main{
    position: relative;
    border: 1px solid #DDD;
    border-top: 0;
    border-bottom: 0;
    .todo-ul{
      padding: 0px;
      margin: 0px;
      list-style: none;
    }
  }

  /* todos底部 */
  .footer{
    display: flex;
    height: 20px;
    padding: 10px 0;
    border: 1px solid #DDD;
    border-top-width: 0px;
    overflow: hidden;
    text-align: center;
    color: #777;
    font-size: 12px;
    &.slide-enter-active, &.slide-leave-active{
      transition: all .5s ease-in-out;
    }
    &.slide-enter, &.slide-leave-active{
      height: 0;
      padding: 0;
      opacity: 0;
    }
    .left-wrap {
      flex: 0 0 80px;
    }
    .center-wrap {
      flex: 1;
      ul.filters {
        padding: 0px;
        margin: auto;
        list-style: none;
        li{
          display: inline-block;
          width: 50px;
          cursor: pointer;
          &:hover a{
            border: 1px solid rgba(175, 47, 47, 0.1);
            border-radius: 5px;
          }
          a.selected,  &:hover a.selected{
            border: 1px solid rgba(175, 47, 47, 0.3);
            border-radius: 5px;
          }
        }
      }
    }
    .right-wrap {
      flex: 0 0 80px;
      .clear-completed {
        color: #777;
        cursor: pointer;
        outline: none;
        font-size: 12px;
        &.fade-enter-active, &.fade-leave-active {
          transition: all 0.4s ease-in-out;
        }
        &.fade-enter, &.fade-leave-active {
          opacity: 0;
        }
      }
    }
  }
}
</style>
