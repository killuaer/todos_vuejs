# todos_vuejs

> todos project

## 构建配置

``` bash
# 安装依赖
npm install

# 在localhost:8088服务上运行，端口号可通过'config/index.js'文件中的port属性进行设置
npm run dev

# 快速构建产品
npm run build

```


## step-1：新增任务和显示任务列表
### 目标 
1. HTML页面结构--- div(容器)、h2(标题)、input(新增任务)、ul(显示任务列表)
2. 为input元素绑定新增任务的方法
3. 在ul元素中显示任务列表的内容

### 实施内容
1. 在input元素上用v-model双向绑定newTodo,通过@keyup.enter绑定addTodo方法
2. 在ul元素上用v-for遍历todos,预定义添加到todos里的todo是一个对象，方便以后扩展

### 实施要点
1. 新增任务方法要进行非空串、非空格和任务重复的判断
2. @keyup.enter是v-on:keyup.enter的缩写


## step-2：任务列表内容持久化存储和读取
### 目标
1. 对任务列表内容进行浏览器持久化本地存储和读取
2. 任务列表内容变化时及时保存数据

### 实施内容
1. 抽象出webStorage类，接收一个存储标识名参数，对外暴露webStorage实例，它提供存储和读取浏览器数据的方法
2. 添加watch选项，检测todos数据的变化，再及时保存数据到浏览器中

### 实施要点
1. 浏览器数据是以JSON格式进行存储和读取，当要读取的数据不存在时，将其赋值为[]，当浏览器数据解析错误时，将其重置为[]，当存储标识名未传递时，则使用'default'当做标识名。


## step-3：任务状态和样式的切换
### 目标
1. 为每个任务添加任务完成和未完成状态的切换事件
2. 不同任务状态下有不同的样式显示
3. 点击任务内容也可实现任务状态的切换

### 实施内容
1. 为todo添加一个completed属性，记录任务状态，默认值为false
2. 在任务列表中为每个任务前添加一个复选框，用于切换任务状态，再把值v-model到todo.completed
3. 通过判断todo.completed的真假，用v-bind:class来切换不同的样式
4. 通过label的for属性，可以绑定到id相同的表单元素，这就要求动态赋值，就用到了v-bind指令和v-for的额外参数index

### 实施要点
1. 默认的watch选项，只能检测到数值、引用和数量等变化，而不能检测到引用的内部变化（todo对象中completed属性改变），因此需要添加额外的配置 
```
	watch: {
		todos: {
			handler: function (todos){
				 WebStorage("todos-vuejs").save(todos)
			},
			deep: true;
		}
	}
```
详细介绍可以查看官方文档 [#watch](http://cn.vuejs.org/v2/api/#watch)

**tips: vue不能检测到对象属性的添加或删除，因此属性必须在data对象上存在，它才能响应式变化。**

按照之前的例子，就是之前已存在的todo中没有completed属性，所以这个todo就不能响应式变化，也就是不能切换任务状态，而新增加的todo，在添加到todos前就存在了completed属性，它能正常的响应式变化，具体内容参考:[响应式原理](http://cn.vuejs.org/v2/guide/reactivity.html)


## step-4：动态显示删除按钮及绑定删除任务事件
### 目标
1. 动态显示删除按钮
2. 为按钮绑定删除任务事件

### 实施内容
1. 添加一个按钮，默认不显示，通过CSS的伪类选择器:hover来切换隐藏和显示（vue的@mouseenter+@mouseleave同样可以实现类似为类:hover效果）
2. 添加removeTodo(todo)方法，它接收todo对象，然后通过indexOf找到在任务数组中的位置，再通过splice方法移除该项，数据会响应式存储(watch)

### 实施要点
1. 从任务列表中移除任务，要先找到任务的位置，需要注意的是，indexOf判断的是对象的引用，因为都是来自同一个数组，所以才能找到位置


## step-5：全选和全不选任务状态
### 目标
1. 点击全选复选框，实现全选和全不选任务状态的效果
2. 当全部任务状态为完成时，全选复选框自动选中，反之不选中。

### 实施内容
1. 添加一个复选框，其值v-model绑定到allDone,且allDone是一个计算属性，其get方法返回判断未完成任务的数量是否为0，为0则返回真，全选按钮被选中，反之不选中，其set方法对任务列表中所有任务进行全部完成或未完成的状态切换。
2. 当任务数量等于0，那么全选框用v-show隐藏起来

### 实施要点
1. 计算属性是依赖性变化，当方法内的数据变化时就会调用计算属性的get方法。
2. 获取未完成任务数量可使用filter对todos进行未完成任务的过滤
3. 设置全选或全不选可使用forEach对todos进行状态修改的操作


## step-6-1：过滤显示全部、已完成、未完成任务
### 目标
1. 添加过滤选项的html结构
2. 添加全部、已完成、未完成任务列表的点击事件，显示过滤后的任务列表。

### 实施内容
1. 过滤选项结构 ---- div(底部容器)、ul(过滤选项)
2. 当任务数量等于0，则用v-show隐藏底部容器
3. 添加实例属性visibility，用于保存过滤选项选中的值。
4. 通过@click在每个过滤选项上绑定一个赋值给visibility的JS表达式
5. 创建新的对象filters，它封装了三个方法all、active、completed，分别返回全部任务列表、未完成任务列表和已完成任务列表。最后选择什么列表依赖于visibility的值
6. 添加计算属性filteredTodos，把显示任务列表的循环替换成显示过滤任务列表的循环，其值为`filters[this.visibility](this.todos)`

### 实施要点
1. visibility(变化)-->filteredTodos(计算)-->filters(调用)-->filteredTodos(返回值)
2. vue渲染元素默认采用“就地复用”的方式，来达到性能提升的效果，但它有时会因此带来莫名其妙的问题，为了避免复用元素，可以在v-for元素上绑定:key=XX来标识身份，避免就地复用。
比如说，点击未完成任务过滤选项，显示出三个任务内容，点击第二个任务完成，会出现复选框选中的值保留到第三个任务上，可实际上第三任务依旧是未完成的情况


## step-6-2：通过路由过滤显示任务列表
### 目标
1. 从App.vue中分离出todos组件，再通过路由调用组件。
2. 点击不同的过滤选项后，通过路由返回不同的过滤任务列表

### 实施内容
1. 在main.js中引入vue-router、自定义路由配置文件，然后全局应用路由功能Vue.use(VueRouter)和路由配置文件，再把路由实例添加到vue实例上，同时vue上的template中要有路由出口router-view,最后再把vue实例挂载到html元素上
2. 路由配置中路由的访问都返回todos组件，其传递的参数可以通过this.$route.params访问。由于组件复用的原因，所以需要watch $route的变化，才能改变visibility的值
3. router-link在HTML5 hisitory 模式下，它会拦截点击事件不让浏览器重新加载页面，同时可配置tag属性生成别的标签
4. 获取到路由参数值，再过滤显示任务列表，具体处理参照step-6-1

### 实施要点
1. 导入路由 --> 配置和应用路由 --> 路由添加到vue实例中 --> vue实例挂载到页面中
2. 过滤选项(点击) --> 路由配置(匹配项) --> 组件(返回) -->  router-view视图(显示)


## step-7：显示未完成任务数量和移除已完成任务
### 目标
1. 添加移除已完成任务的按钮
2. 显示未完成任务的数量

### 实施内容
1. 当未完成任务列表数量小于总任务数量，显示移除已完成任务列表按钮。
2. 移除已完成任务列表是通过把未完成任务列表赋值给全部任务todos
3. 添加一个计算属性remaining,记录未完成任务数量

### 实施要点
1. 移除按钮只有在完成任务存在时才显示。


## step-8：编辑任务列表中的任务内容
### 目标
1. 双击任务内容，进入任务编辑状态，并获得焦点，已完成任务不能编辑内容。
2. 失去焦点时，任务内容为空，则删除该任务，否则保存修改后的任务内容。
3. 按下esc键，撤消修改，返回之前的任务内容
4. 移除点击文本复选框选中的功能，这和双击编辑任务冲突

### 实施内容
1. 为任务内容绑定双击事件执行editTodo，它会先判断任务是否未完成，若是，则将会把原始任务内容缓存到临时添加的beforeEditCache属性，同时把todo赋值给编辑时的任务内容editedTodo，若不是，那么不执行赋值
2. 是否显示任务文本编辑框与获得焦点，需要任务编辑对象等于原始任务对象，即todo == editedTodo。
3. 任务文本编辑框获得焦点需要通过自定义的指令
4. 为任务文本编辑框绑定失去焦点事件执行doneEdit，它会将对editedTodo的title进行非空和非重复的判断，若为空，则移除该任务项，若内容重复，则撤销修改，否则退出编辑状态，并重置editedTodo对象为null
5. 为任务文本编辑框绑定键盘enter事件执行doneEdit
6. 为任务文本编辑框绑定键盘esc事件执行cancelEdit,它会重置editedTodo对象为null,再撤销任务内容的修改,即todo.title = this.beforeEditCache
7. 任务文本编辑框需要v-model绑定todo.title，确保数据发生变化时，视图(隐藏的)也跟着变化。

### 实施要点
1. 进入任务编辑状态时，原始任务对象会被赋值给任务编辑对象，由于它们引用同一个对象，所以可以通过判断它们是否相等，来选择显示哪个任务下的任务编辑区
2. 自定义指令，其值可以是钩子对象，钩子对象上可以配置各种钩子函数，其值也可以是函数，则为简写方式，会在 bind 和 update 钩子上做重复动作。钩子函数拥有两个参数，第一个参数是指令所绑定的元素el，第二个参数是一个绑定对象binding，它包含传入的值和值的变化等


## step-9：HTML语义化、结构重排和功能修复
### 目标
1. 通过section、header和footer标签来划分区域，section标记todos功能的容器，其包含header头部、section主体内容和footer底部。

### 实施内容
1. header头部，它包含标题(h2)、全选复选框(input)和新增任务输入框(input).
2. section主体内容，它包含任务列表的渲染(ul),每个任务项(li)由任务视图区(section)和编辑框(input)组成，任务视图区包含单项复选框(input)、任务内容(label)和删除按钮(button)
3. footer底部，它包含显示未完成任务数量区(span)、过滤选项区(ul)和移除所有已完成任务按钮(button),过滤选项区中每个li包含路由访问(router-link)

### 修复内容
1. v-for循环中li复用问题，不复用li就要求，当DOM更新时，v-bind:key的值是不同的，同时又要求切换路由后key值也是不一样的，那么key值就应该是`todo.titile+visibility`，为之后的过渡效果做铺垫
2. 任务编辑框的内容不应该直接双向绑定到todo.title,因为这会引起DOM数据的更新，从而让任务编辑框失去焦点(不复用元素的情况下)，只有当确认编辑框内容(enter)、失去焦点(blur)或撤销编辑(esc)时，才和todo.title关联，再引起DOM数据的变化
3. 任务编辑框获得焦点后，默认移动光标至文本末尾，支持主流浏览器。


## step-10：任务列表渐进过渡
### 目标
1. 当进行新增任务、删除任务或改变过滤选项时，为任务列表添加过渡效果

### 实施内容
1. 渲染整个列表，需要用到<transition-group>组件，它要求内部元素总是需要提供唯一的key属性值，其次它可以通过tag特性更换为其他元素，故用<transition-group>替代ul，并使其tag值为ul
2. 在<transition-group>上添加JavaScript过渡钩子，
钩子有：before-enter、enter、after-enter、enter-cancelled、before-leave、leave、after-leave和leave-cancelled，需要使用到的钩子为，berfore-enter、enter和leave
3. 引入第三方javaScript动画库---Velocity.js，优化过渡效果。

### 实施要点
1. 通过`npm install velocity-animate --save`安装Velocity.js，然后再import到组件中
2. 过渡效果处理，内容进入前，高度和透明度为0，内容进入中，高度慢慢变为label的高度和透明度变为1，当内容离开中，高度和透明度慢慢变为0
3. DOM数据更新时，:key值一定要不一样，不然会造成复用，从而达不到想要的效果。比如说，:key=index时，共有三项，移除第一项，会发现下面有过渡效果，而不是移除项有过渡效果。故:key=todo.title+visibility，这样切换过滤项时，也会有过渡效果。


## step-11：抽离出Todo.vue组件
### 目标
1. 从Todos.vue中抽离出Todo.vue,使功能区分更明确

### 实施内容
1. 父组件(Todos.vue)传递给子组件(Todo.vue)的参数，除了需要绑定到子组件上，还需要在子组件的props属性上声明，而子组件反馈数据给父组件是通过事件，它需要在子组件上绑定监听事件，通过在子组件内this.$emit('even','args')触发父组件上的监听事件，切记，定义在子组件上的监听事件不要加传参的括号,不然它会误认为是父组件上的参数获取，而不是子组件的参数获取
```
<todo v-for=" (todo,index) in filteredTodos " 
          :todo="todo" 
          :todos="todos"
          :key="todo.task"
          @doneEdit="doneEdit"
          @removeTodo="removeTodo"></todo>
```
todos和todo是要传递的参数，而doneEdit和removeTodo是监听事件，等待子组件的触发。
2. 在Todo.vue中，由于每个组件都有自己的editedTodo，而不是共享同一个，所以不需要判断`editedTodo==todo`来确定哪个需要编辑，只需要判断true/false即可
3. 基于官方的建议，不应该在子组件内修改父组件的值，所以才会添加一个doneEdit的监听事件，不然直接用`todo.task = this.editedInput`即可修改任务内容

### 修复内容
1. 把底部过滤选项整合到options对象中，再通过v-for遍历循环出来
2. 把todo对象里的title属性改名为task,名称更直观一点
3. 实现过渡效果必要的:key的值修改为`todo.task`，因为它能减少性能的损耗，尤其是任务内容多的时候，之前的key值会在切换路由后重新加载整个任务列表，哪怕没有内容变化(效果好看？)，性能没有达到优化。


## step-12：运用Vuex进行状态管理
### 目标
1. 运用Vuex管理todos应用的数据，使得数据的每次改变都是可跟踪的

### 实施内容
1. 把todos和visibility数据放入到state对象中进行管理，提交mutation是更改todos数据的唯一方法。
2. 把所有能直接影响todos和state数据的操作抽离出来，变成mutation来操作todos数据，包括有addTodo、removeTodo、removeCompleted、doneEdit、toggleTodo、toggleAll和changeVisibility
3. 官方建议把mutation传入的参数(载荷)定义为对象，同时抽离mutation事件类型到mutation-type.js的文件中，方便查看都有哪些mutation
4. 把filteredTodos和remaining数据的获取通过store的getter来管理
5. 自定义store插件来管理数据的存储

### 实施要点
1. 运用vue实例的生命周期created选项，在实例观测数据和初始化事件之后调用，检查过滤选项visibility是否正确，并提交mutation给store当作它的初始值
2. 修改todos和visibility数据，只能通过mutation提交，而且这个数据也包括todos内的todo内容的修改，对于todos和visibility数据的获取，它们应该被写入到computed属性中
3. 由于双向绑定容易不经过mutation就修改了数据，所以不建议使用。当然也可以通过双向绑定computed属性值，再显式定义getter和setting方法来获取和提交mutation
4. 自定义的store插件能够在每次mutation提交时都调用到，所以这很适合调用存储数据的方法


## step-13：转化成ES6语法和用eslint规范代码风格
### 目标
1. 用ES6语法简化js代码
2. 运用eslint规范代码风格

### 实施内容
1. ES6语法主要使用了箭头函数、函数参数的解构赋值、Class、属性和方法的简写
2. eslint的配置和使用，参考vue-cli的配置
3. 善用原生的DOM操作，vue实例方法的第一个参数默认接收绑定该事件元素的Event对象，从而可以获取和操作该元素下的数据

### 实施要点
1. 运用箭头函数的场景：
	* 无复杂逻辑或无副作用的纯函数，例如map、reduce、filter的回调函数
	* 不要在最外层定义箭头函数，因为在函数内部操作this会很容易污染全局作用域，最起码要在箭头函数外部包含一层普通函数，将this控制在可见的范围内。（箭头函数没有自己的this、argument和caller）
	* 多层函数嵌套不大适用于箭头函数，这会影响阅读性和函数作用范围的识别
2. 对象属性和方法的简写
```
let name = '张三';
let obj = {
	name: name,
	say: function () {
		console.log(`我的名字是${this.name}`);
	}
}
obj.say();

// 相当于下面代码
let name2 = '张三2';
let obj2 = {
	name2,
	say () {
		console.log(`我的名字是${this.name2}`)
	}
}
obj2.say();
```
3. 函数参数的解构赋值
```
function add ([x, y]) {
	return x + y;
}
add([1, 2]);  // 3

function move ({x, y}){
	return [x, y];
}
move({x:3, y:8})  // [3, 8]
```


## step-14：flex布局、less运用和重复数据提示
1. 页面布局采用了flex弹性布局，运用less对样式重新编写，结构层次更清晰
2. 页面的显示是移动设备优先，同时处理了手机横屏和竖屏时，页面自适应的处理
3. 为输入框添加了重复数据提示，当内容为重复数据输入框就会有一个红色的边框阴影，这就需要处理@input事件，同时在watch选项中添加todos，深度检测todos的变化，判断是否需要边框阴影
4. 为todos底部添加过渡效果，并优化任务列表的过渡效果的显示

