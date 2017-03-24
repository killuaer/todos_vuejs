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
1. 过滤选项结构 ----  div、ul、li
2. 当任务数量等于0，则用v-show隐藏过滤选项
3. 添加实例属性visibility，用于保存过滤选项选中的值。
4. 通过@click在每个过滤选项上绑定一个赋值给visibility的JS表达式
5. 创建新的对象filters，它封装了三个方法all、active、completed，分别返回全部任务列表、未完成任务列表和已完成任务列表。最后选择什么列表依赖于visibility的值
6. 添加计算属性filteredTodos，把显示任务列表的循环替换成显示过滤任务列表的循环，其值为`filters[this.visibility](this.todos)`

### 实施要点
1. visibility(点击)-->filteredTodos(计算)-->filters(调用)-->filteredTodos(返回值)
2. vue渲染元素默认采用“就地复用”的方式，来达到性能提升的效果，但它有时会因此带来莫名其妙的问题，为了避免复用元素，可以在v-for元素上绑定:key=XX来标识身份，避免就地复用。
比如说，点击未完成任务过滤选项，显示出三个任务内容，点击第二个任务完成，会出现复选框选中的值保留到第三个任务上，可实际上第三任务依旧是未完成的情况


