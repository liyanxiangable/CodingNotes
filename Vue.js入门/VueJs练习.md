vuejs的语法之前看过一些，但是由于没有什么实战的训练，现在又忘得差不多了。下面从头开始来创建一个项目练习一下。首先需要有nodejs与npm的环境，这个不再赘述。我使用vue-cli来创建项目。vue-cli是一个vue项目的脚手架，可以无配置的创建一个vue项目。

首先安装vue-cli，安装的条件是nodejs版本为4.X以上，6.X最好；npm版本3以上，并且需要git。在命令行输入以下命令：

```
npm install -g vue-cli
```

安装之后就可以使用了，只需要在想要创建项目的目录中执行以下命令：

```
vue init <template-name> <project-name>
```

这样就会在当前目录中创建一个project-name的目录，项目就在这个目录中。比如：

```
vue init webpack firstApp
```

但是这里注意一点，project-name中不能使用大写字母。所以以上的命令会报错：

```
>> Sorry, name can no longer contain capital letters.
```

修改项目名之后按照提示选择，其中我选择了安装vue-router。之后项目就创建好了，cd到项目目录中进行模块的安装就可以启动项目了：

```
cd firstApp
npm install
npm run dev
```

以上就是通过脚手架工具vue-cli来创建一个项目。进行完以上的操作之后，会在目录中创建一个名为project-name的目录，目录中就是初始化的项目。然后可以看到其中生成了一些目录与文件，按照名称排序从上到下，其中build目录用于储存项目构建相关代码；config目录用于储存发i发环境配置相关代码；node_modules用于储存项目以来的模块；src目录用于储存项目源代码；static目录用于储存静态图片。然后是一些文件：.babelrc 是 ES6 语法编译配置，.editorconfig 用于定义代码格式；.gitignore 定义 git 上传需要忽略的文件格式；index.html 是入口页面；package.json 是项目基本信息；README.md 是项目说明。然后说一下 src 源码目录中包含三个子目录，assets 是资源目录，components 用于存放公共组件，router 是路由目录；还包括两个文件，app.vue 是页面入口文件即根组件，main.js是程序入口文件。

当我们使用 npm run dev 来执行热加载的时候，会在 package.json文件中寻找script对象，我们看到这个对象：

```json
  "scripts": {
    "dev": "node build/dev-server.js",
    "start": "node build/dev-server.js",
    "build": "node build/build.js"
  },
```

以上代码中就是说当执行dev命令的时候，就等于执行"node build/dev-server.js"这句话。也就是使用node启动这个build目录的dev-server.js文件，我们再来看一下这个dev-server.js文件。这就是个nodejs为后台的本地开发服务器，大体看了一下这个文件的代码，其实就是利用express创建的服务器，通过webpack来编译项目文件并提供热加载功能。

然后我们添加若干依赖，包括vue-router，vuex，vue-resource，bootstrap等。在项目目录中即package.json文件的同级目录输入一下命令：

```\
npm install vue-router vuex vue-resource bootstrap --save
```

安装以上的包之后，会出现报错，因为还没有进行配置，暂时不用管他。进行完环境的搭建之后，可以对main.js进行修改。main.js 是我们的入口文件，主要作用是初始化vue实例并使用需要的插件。我们看到index.html，文件中的body里除了一个app标签什么都没有。也就是说所有的显示都是由这个id为app的div来规定的，我们就不需要在html里创建dom。那为什么id为app的div就可以显示呢？这是因为用过mainjs脚本，来将页面的内容进行展示。

```javascript
import Vue from 'vue'
import App from './App'
import router from './router'

new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
```

注意到main.js中引入了vue模块，app文件与router目录。就像App作为一个组件，来创建了一个Vue的实例。其中配置还包括这个实例的id为app，路由为router路径以及模板。

以上是简短的介绍，现在我们添加了vue-router，vuex，vue-resource，bootstrap等依赖，于是将这些包引入项目，同样是mainjs中进行引入然后把他们作为中间件使用：

```javascript
import vueRouter from 'vue-router'
import vueResource from 'vue-resource'
import 'bootstrap/dist/css/bootstrap.css'
```

```JavaScript
Vue.use(VueResource)
Vue.use(VueRouter)
```

以下是官方给出的vue-router例子：

```JavaScript
// 0. 如果使用模块化机制编程，導入Vue和VueRouter，要调用 Vue.use(VueRouter)

// 1. 定义（路由）组件。
// 可以从其他文件 import 进来
const Foo = { template: '<div>foo</div>' }
const Bar = { template: '<div>bar</div>' }

// 2. 定义路由
// 每个路由应该映射一个组件。 其中"component" 可以是
// 通过 Vue.extend() 创建的组件构造器，
// 或者，只是一个组件配置对象。
// 我们晚点再讨论嵌套路由。
const routes = [
  { path: '/foo', component: Foo },
  { path: '/bar', component: Bar }
]

// 3. 创建 router 实例，然后传 `routes` 配置
// 你还可以传别的配置参数, 不过先这么简单着吧。
const router = new VueRouter({
  routes // （缩写）相当于 routes: routes
})

// 4. 创建和挂载根实例。
// 记得要通过 router 配置参数注入路由，
// 从而让整个应用都有路由功能
const app = new Vue({
  router
}).$mount('#app')

// 现在，应用已经启动了！
```

可以看出，使用vue-router路由一共分为5步：

1. 引入vue-router模块，并在vue对象使用vue-router模块。
2. 定义路由组件，组件可以引入
3. 定义路由，注意这是一个各个子组件的**数组**
4. 创建router实例并进行配置
5. 创建并挂载实例

非常的清晰。我在这里选择通过引入的方式来定义路由组件，所以在components这个用于存放各个组件的目录中创建子组件，然后引入。

```JavaScript
import Home from 'components/home'

Vue.use(VueResource)
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Home
  },
]

const router = new VueRouter({
  routes: routes
})

new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
```

因为模块化程序，当然也可以将router作为一个组件编写好之后引入到main.js中来。做完了以上的路由，就可以对index页面的组件进行具体开发了。

首先在app.vue中添加一个侧边栏：

```html
<template>
  <div id="oparetionBar">
    <nav class="navbar navbar-default">
      <div class="container">
        <a class="navbar-brand" href="#">
          <i class="glyphicon glyphicon-time"></i>
          计划板
        </a>
        <ul class="nav navbar-nav">
          <li><router-link to="/home">首页</router-link></li>
          <li><router-link to="/time-entries">计划列表</router-link></li>
        </ul>
      </div>
    </nav>
    <div class="container">
      <div class="col-sm-3">
        
      </div>
      <div class="col-sm-9">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>
```

可以看到，我们把原来app.vue中的模板进行了修改替换。其中的内容全部去掉，添加进我们想要实现的顶部导航栏。这与html编写没有什么差别。但是有一点要注意的是，我们的要进行变动的元素，也就是进行路由的组件，不再是进行dom操作，而是通过vue-router实现。那么以前的点击事件切换dom元素，在vue中就是根据路由链接来切换视图。在以上的组件中所表现的就是有两个li元素，他们的点击链接不再使用a元素，而是使用router-link，其中这个元素有一个to属性，指向的就是在vue-router实例中定义的对应path链接的组件，然后视图的表现就是router-view的切换。这个元素就是我们不同的路由指向的不同的组件的视图。在以上的代码中，一共有两个router-link，所以可以在两个router-view之间进行切换。

导航栏完成之后开始对正文部分进行编辑，之前引入了home组件一直没有定义，现在来实现这个组件，修改home.vue代码：

```HTML
<template>
  <div class="jumbotron">
    <h1>任务追踪</h1>
    <p>
      <strong>
        <router-link to="/time-entries">创建一个任务</router-link>
      </strong>
    </p>
  </div>
</template>
```

同理，还是使用了vue-router的router-link功能，但是视图并不在这里显示，所以并没有定义router-view。

现在回到app.vue这个根组件，下面添加一个侧边栏。注意到我们之前的模板当中有个栅栏布局分了3个单位长度的div，我们这里边添加侧边栏，子组件的名称就叫做SideBar。

```html
  <div class="container">
    <div class="col-sm-3">
      <sidebar></sidebar>
    </div>
    <div class="col-sm-9">
      <router-view></router-view>
    </div>
  </div>
```

用到了这个组件，所以应当引入这个组件，在scripts中进行引入：

```JavaScript
import SideBar from './components/sidebar.vue'
```

然后对sidebar.vue进行创建：

```vue
<template>
  <div class="panel panel-default">
    <div class="panel-heading">
      <h1 class="text-center">已有时长</h1>
    </div>

    <div class="panel-body">
      <h1 class="text-center">{{ time }} 小时</h1>
    </div>

  </div>
</template>

<script>
  export default {
    computed: {
      time() {
        return this.$store.state.totalTime
      }
    }
  }
</script>
```

可以看到，组件中定义方法time。但是由于还没有定义相关变量，所以这里会报错，从而左侧边栏子组件不渲染出来。如果想先看一下大体布局的话可以先注释掉脚本代码。

接下来创建计划列表组件，新建一个TimeEntries文件：

```vue
<template>
  <div>
    //`$route.path`是当前路由对象的路径，会被解析为绝对路径当
    <router-link
    v-if="$route.path !== '/time-entries/log-time'"
    to="/time-entries/log-time"
    class="btn btn-primary">
    创建
    </router-link>

    <div v-if="$route.path === '/time-entries/log-time'">
      <h3>创建</h3>
    </div>

    <hr>

    <router-view></router-view>

    <div class="time-entries">
      <p v-if="!plans.length"><strong>还没有任何计划</strong></p>

      <div class="list-group">
        <--
          v-for循环，注意参数顺序为(item,index) in items
        -->
        <a class="list-group-item" v-for="(plan,index) in plans">
        <div class="row">
          <div class="col-sm-2 user-details">

            <--
            `:src`属性，这个是vue的属性绑定简写`v-bind`可以缩写为`:`
             比如a标签的`href`可以写为`:href`
            -->

              <img :src="plan.avatar" class="avatar img-circle img-responsive" />
            <p class="text-center">
              <strong>
                {{ plan.name }}
                </strong>
            </p>
            </div>

            <div class="col-sm-2 text-center time-block">
              <h3 class="list-group-item-text total-time">
                <i class="glyphicon glyphicon-time"></i>
                {{ plan.totalTime }}
                </h3>
              <p class="label label-primary text-center">
                <i class="glyphicon glyphicon-calendar"></i>
                {{ plan.date }}
                </p>
            </div>

            <div class="col-sm-7 comment-section">
              <p>{{ plan.comment }}</p>
            </div>

            <div class="col-sm-1">
              <button
                class="btn btn-xs btn-danger delete-button"
                @click="deletePlan(index)">
                X
                </button>
            </div>

          </div>
          </a>

      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name : 'TimeEntries',
    computed : {
      plans () {
        // 从store中取出数据
        return this.$store.state.list
      }
    },
    methods : {
      deletePlan(idx) {
        // 减去此计划时间
        this.$store.dispatch('decTotalTime',this.plans[idx].totalTime)
        // 删除该计划
        this.$store.dispatch('deletePlan',idx)
      }
    }
  }
</script>

<style>
  .avatar {
    height: 75px;
    margin: 0 auto;
    margin-top: 10px;
    margin-bottom: 10px;
  }
  .user-details {
    background-color: #f5f5f5;
    border-right: 1px solid #ddd;
    margin: -10px 0;
  }
  .time-block {
    padding: 10px;
  }
  .comment-section {
    padding: 20px;
  }
</style>

```

既然数据是共享的，所以我们需要把数据存在 `store` 里。在src下创建个目录为 `store`，在 `store` 下分别创建4个js文件 `actions.js` , `index.js` , `mutation-types.js` , `mutations.js`。关于vuex，他是一个vue专门的状态管理模式，他采用集中管理来存储所有组件的状态。当多组件共享状态的时候，单项数据流的简洁性很容易遭到破坏。分以下两种情况：

1. 多个视图依赖一个状态
2. 来自不同视图的行为需要变更同一状态

每一个 Vuex 应用的核心就是 store（仓库）。"store" 基本上就是一个容器，它包含着你的应用中大部分的**状态(state)**。Vuex 和单纯的全局对象有以下两点不同：

1. Vuex 的状态存储是响应式的。当 Vue 组件从 store 中读取状态的时候，若 store 中的状态发生变化，那么相应的组件也会相应地得到高效更新。
2. 你不能直接改变 store 中的状态。改变 store 中的状态的唯一途径就是显式地**提交(commit) mutations**。这样使得我们可以方便地跟踪每一个状态的变化，从而让我们能够实现一些工具帮助我们更好地了解我们的应用。

使用vuex后，之前在vue实例内做的操作和数据的计算现在都不再自己做了，而是交由对象store来做了。store对象是Vuex.Store的实例。在store内有分为state对象和mutations对象，其中的state放置状态，mutations则是一个会引发状态改变的所有方法。

在以上的代码中，如果要使用vuex储存时间。那么就要创建vuex实例，在一个vue应用中有一个vuex的store实例就够了。在src资源目录中的store目录中创建index.js，来创建store实例：

```JavaScript
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

// 模拟数据
const state = {
  totalTime: 0,
  list: [{
    name : '二哲',
    avatar : 'https://sfault-avatar.b0.upaiyun.com/147/223/147223148-573297d0913c5_huge256',
    date : '2016-12-25',
    totalTime : '6',
    comment : '12月25日完善，陪女朋友一起过圣诞节需要6个小时'
  }]
};

export default new Vuex.Store({
  state,
})
```

如代码所示，首先是让Vue调用use方法使用vuex。然后就是调用Vuex.Store方法来实例化一个store对象。传入数据参数。这样含有数据的vuex store对象模块就创建好了，然后需要在main.js中进行注册：

```JavaScript
import store from './store'

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
```

还是在Vue实例中进行注册，属性为store，参数比较神奇，就是这个store目录。然后可以看到，组件向外暴露的时候，也是想平时vue写法一样，不过数据源则是 this.$store.state.XXX。另外有个dispatch，这是用来出发action的，action又是什么呢？它类似于mutation，但是有两点不同：

1. action提交的是mutation，而不是直接更改状态
2. action可以包含任何异步操作

所以其中这个 deletePlan 的方法，是这样理解：













参考链接：

1. [vue-cli](https://www.npmjs.com/package/vue-cli)
2. [vue-cli github](https://github.com/vuejs/vue-cli)
3. [vue-cli 生成目录与文件](http://blog.csdn.net/qq_34543438/article/details/72868546?locationNum=3&fps=1)
4. [引用关系](https://segmentfault.com/q/1010000008863946)
5. [vue-router 文档](https://router.vuejs.org/zh-cn/essentials/getting-started.html)
6. [vuex 介绍](https://segmentfault.com/a/1190000007516967)
7. [export default](http://es6.ruanyifeng.com/?search=import&x=0&y=0#docs/module#export-default-%E5%91%BD%E4%BB%A4)
8. [vuex 基础例子](https://jsfiddle.net/n9jmu5v7/1269/)
9. [vuex dispatch](https://vuex.vuejs.org/zh-cn/actions.html)
10. [vuex 概括](http://blog.csdn.net/teckeryu/article/details/54915207)
11. [Vuex，从入门到入门](https://zhuanlan.zhihu.com/p/24357762)
12. ​