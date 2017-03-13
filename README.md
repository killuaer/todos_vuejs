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


## step1
### 目标
1. HTML页面结构--- div、h2、input、ul
2. 为input元素添加新增任务的方法
3. 在ul元素中显示任务列表的内容

### 实施内容
1. 在input元素上用v-model双向绑定newTodo,通过@keyup.enter监听addTodo方法
2. 在ul元素上用v-for遍历todos,预定义添加到todos里的todo是一个对象，方便以后扩展

### 实施要点
1. 新增任务方法要进行非空串、非空格和任务重复的判断

## step2
### 目标
1. 对任务列表内容进行浏览器持久化本地存储和读取
2. 任务列表内容变化时及时保存数据

### 实施内容
1. 抽象出webStorage类，接收一个存储标识名参数，对外暴露webStorage实例，它提供存储和读取浏览器数据的方法
2. 添加watch选项，监听todos数据的变化，再及时保存数据到浏览器中

### 实施要点
1. 浏览器数据是以JSON格式进行存储和读取，其次当要读取的数据不存在时，将其赋值为空数组[]

## step3
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
按照之前的例子，就是之前已存在的todo中没有completed属性，所以这个todo就不能响应式变化，也就是不能切换任务状态，而新增加的todo，在添加到todos前就存在了completed属性，它能正常的响应式变化
具体内容参考:[响应式原理](http://cn.vuejs.org/v2/guide/reactivity.html)






























