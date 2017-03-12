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































