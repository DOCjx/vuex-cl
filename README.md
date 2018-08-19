# vuex-cl
基于vue，vuex。能使用vuex的记录变更、状态管理、时间旅行等特性，但是却没有使用vuex的繁锁步骤。简单易用

## 使用
- 在原来的项目中引入

``` bash
import {store as connectStore} from './connect/';
import app from './pages/app/';

const store = new connectStore();

export default {
    components: {
        app
    },
    store
};
```

- 在独立的项目中引入

``` bash
import Vue from 'vue';
import Root from './index';
import {store as connectStore} from './connect/';
const store = new connectStore();

new Vue({
    el: '#root',
    store,
    render: h => h(Root)
});
```
- 运行例子

``` bash
npm run dev
```

- 其它相对于正常vue项目需要改动的地方请参考例子

## 特性
- vue中所有的method都变身vuex中的actions
- vuex中所有的state都自动在组件中可以使用
- 加深同步异步分离思想。mutations是纯函数，所有异步操作都应放在method中
- 组件名就是一个命名空间，dispatch或commit其它组件时需要加上其它组件的组件名
- 分层清晰，职责分明。完全组件化，无需在项目中独立store，每个组件处理组件内部的事情。方便通用组件封装、团队协作
- 可以快速在没有使用vuex的项目中构建中大型应用，却没有使用vuex的繁琐，需要的只是引入connect

## 建议
- 区分组件内部data和组件state。组件state是可以被其它组件commit一个mutations修改的，而data则完全组件内部维护
- 当一个method被其它组件dispatch之后，它的this将变为store而不是组件
- 有了vuex之后简单的路由能自己维护，不再需要引入vue-router

## 目录

``` bash
/src/                       # 项目业务代码
 ├── /connect/              # connect核心文件
 ├── /pages/                # 程序根目录
 │    └── /app/             # app页面
 │         ├── /components/ # app页下的组件
 │         │    └── ...
 │         ├── app.js       # app页业务逻辑
 │         ├── module.js    # app页状态描述和改变状态的纯函数
 │         ├── index.scss   # app页样式文件
 │         └── index.vue    # app页入口和展示文件
 ├── main.js                # 入口文件
 └── index.vue              # 根容器
 ```