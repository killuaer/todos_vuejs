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

## step1：新增任务和显示任务列表
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


## step2：任务列表内容持久化存储和读取
### 目标
1. 对任务列表内容进行浏览器持久化本地存储和读取
2. 任务列表内容变化时及时保存数据

### 实施内容
1. 抽象出webStorage类，接收一个存储标识名参数，对外暴露webStorage实例，它提供存储和读取浏览器数据的方法
2. 添加watch选项，检测todos数据的变化，再及时保存数据到浏览器中

### 实施要点
1. 浏览器数据是以JSON格式进行存储和读取，当要读取的数据不存在时，将其赋值为[]，当浏览器数据解析错误时，将其重置为[]，当存储标识名未传递时，则使用'default'当做标识名。


































