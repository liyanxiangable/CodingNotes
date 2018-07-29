---
title: vue-router路由使用
date: 2017-04-03 12:53:16
tags:
---

一、开始

用 Vue.js + vue-router 创建单页应用，是非常简单的。使用 Vue.js 时，就已经把组件组合成一个应用了。要把 vue-router 加进来，只需要配置组件和路由映射，然后告诉 vue-router 在哪里渲染它们。

对于html：
	`<div id="app">
	  <h1>Hello App!</h1>
	  <p>
	    <!-- 使用 router-link 组件来导航. -->
	    <!-- 通过传入 `to` 属性指定链接. -->
	    <!-- <router-link> 默认会被渲染成一个 `<a>` 标签 -->
	    <router-link to="/foo">Go to Foo</router-link>
	    <router-link to="/bar">Go to Bar</router-link>
	  </p>
	  <!-- 路由出口 -->
	  <!-- 路由匹配到的组件将渲染在这里 -->
	  <router-view></router-view>
	</div>`

对于javascript：
	`// 0. 如果使用模块化机制编程，导入Vue和VueRouter，要调用 Vue.use(VueRouter)

	// 1. 定义（路由）组件。
	// 可以从其他文件 import 进来
	const Foo = { template: '<div>foo</div>' }
	const Bar = { template: '<div>bar</div>' }
	
	// 2. 定义路由
	// 每个路由应该映射一个组件。 其中"component" 可以是
	// 通过 Vue.extend() 创建的组件构造器，
	// 或者，只是一个组件配置对象。
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
	
	// 现在，应用已经启动了！`

对应到仿写饿了么app实际的应用中，代码如下：
	`import Vue from 'vue';
	import VueRouter from 'vue-router';
	import Goods from './components/goods/goods';
	import Ratings from './components/ratings/ratings';
	import Seller from './components/seller/seller';
	
	Vue.use(VueRouter);
	
	const routes = [
	  { path: '/goods', component: Goods },
	  { path: '/ratings', component: Ratings },
	  { path: '/seller', component: Seller }];
	
	const router = new VueRouter({
	  routes,
	});
	
	new Vue({
	  el: '#app',
	  template: '<App/>',
	  components: { App },
	  router,
	}).$mount('#app');`


二、动态路由匹配

我们经常需要把某种模式匹配到的所有路由，全都映射到同个组件。例如，我们有一个 User 组件，对于所有 ID 各不相同的用户，都要使用这个组件来渲染。那么，我们可以在 vue-router 的路由路径中使用『动态路径参数』（dynamic segment）来达到这个效果：
	`const User = {
	  template: '<div>User</div>'
	}
	
	const router = new VueRouter({
	  routes: [
	    // 动态路径参数 以冒号开头
	    { path: '/user/:id', component: User }
	  ]
	})`
现在，像 /user/foo 和 /user/bar 都将映射到相同的路由。
一个『路径参数』使用冒号 : 标记。当匹配到一个路由时，参数值会被设置到 this.$route.params，可以在每个组件内使用。于是，我们可以更新 User 的模板，输出当前用户的 ID：
	`const User = {
	  template: '<div>User {{ $route.params.id }}</div>'
	}`

1. 响应路由参数的变化
当使用路由参数时，例如从 /user/foo 导航到 user/bar，原来的组件实例会被复用。因为两个路由都渲染同个组件，比起销毁再创建，复用则显得更加高效。不过，这也意味着组件的生命周期钩子不会再被调用。
复用组件时，想对路由参数的变化作出响应的话，可以简单地 watch（监测变化） $route 对象：
	`const User = {
	  template: '...',
	  watch: {
	    '$route' (to, from) {
	      // 对路由变化作出响应...
	    }
	  }
	}`
2. 高级匹配模式
vue-router 使用 path-to-regexp 作为路径匹配引擎，所以支持很多高级的匹配模式，例如：可选的动态路径参数、匹配零个或多个、一个或多个，甚至是自定义正则匹配。
3. 匹配优先级
有时候，同一个路径可以匹配多个路由，此时，匹配的优先级就按照路由的定义顺序：谁先定义的，谁的优先级就最高。


三、嵌套路由

实际的应用界面，通常由多层嵌套的组件组合而成。
	`<div id="app">
	  <router-view></router-view>
	</div>
	const User = {
	  template: '<div>User {{ $route.params.id }}</div>'
	}
	
	const router = new VueRouter({
	  routes: [
	    { path: '/user/:id', component: User }
	  ]
	})`
这里的 <router-view> 是最顶层的出口，渲染最高级路由匹配到的组件。同样地，一个被渲染组件同样可以包含自己的嵌套 <router-view>。例如，在 User 组件的模板添加一个 <router-view>：
	`const User = {
	  template: `
	    <div class="user">
	      <h2>User {{ $route.params.id }}</h2>
	      <router-view></router-view>
	    </div>
	  `
	}`
要在嵌套的出口中渲染组件，需要在 VueRouter 的参数中使用 children 配置：
	`const router = new VueRouter({
	  routes: [
	    { path: '/user/:id', component: User,
	      children: [
	        {
	          // 当 /user/:id/profile 匹配成功，
	          // UserProfile 会被渲染在 User 的 <router-view> 中
	          path: 'profile',
	          component: UserProfile
	        },
	        {
	          // 当 /user/:id/posts 匹配成功
	          // UserPosts 会被渲染在 User 的 <router-view> 中
	          path: 'posts',
	          component: UserPosts
	        }
	      ]
	    }
	  ]
	})`


四、编程式的导航

除了使用 <router-link> 创建 a 标签来定义导航链接，我们还可以借助 router 的实例方法，通过编写代码来实现。
router.push(location)
想要导航到不同的 URL，则使用 router.push 方法。这个方法会向 history 栈添加一个新的记录，所以，当用户点击浏览器后退按钮时，则回到之前的 URL。
当点击 <router-link> 时，这个方法会在内部调用，所以说，点击 <router-link :to="..."> 等同于调用 router.push(...)。该方法的参数可以是一个字符串路径，或者一个描述地址的对象。例如：
	`// 字符串
	router.push('home')
	// 对象
	router.push({ path: 'home' })
	// 命名的路由
	router.push({ name: 'user', params: { userId: 123 }})
	// 带查询参数，变成 /register?plan=private
	router.push({ path: 'register', query: { plan: 'private' }})`
router.replace(location)
跟 router.push 很像，唯一的不同就是，它不会向 history 添加新记录，而是跟它的方法名一样 —— 替换掉当前的 history 记录。
router.go(n)
这个方法的参数是一个整数，意思是在 history 记录中向前或者后退多少步，类似 window.history.go(n)。
操作 History
注意到 router.push、router.replace 和 router.go 跟 window.history.pushState、 window.history.replaceState 和 window.history.go相似，实际上它们确实是效仿 window.history API 的。
因此，如果你已经熟悉 Browser History APIs，那么在 vue-router 中操作 history 就是超级简单的。
还有值得提及的，vue-router 的导航方法 （push、 replace、 go） 在各类路由模式（history、 hash 和 abstract）下表现一致。


五、命名路由

通过一个名称来标识一个路由显得更方便一些，特别是在链接一个路由，或者是执行一些跳转的时候。你可以在创建 Router 实例的时候，在 routes 配置中给某个路由设置名称。
	`const router = new VueRouter({
	  routes: [
	    {
	      path: '/user/:userId',
	      name: 'user',
	      component: User
	    }
	  ]
	})`
要链接到一个命名路由，可以给 router-link 的 to 属性传一个对象：
	`<router-link :to="{ name: 'user', params: { userId: 123 }}">User</router-link>`
这跟代码调用 router.push() 是一回事：
	`router.push({ name: 'user', params: { userId: 123 }})`
这两种方式都会把路由导航到 /user/123 路径。


六、命名视图

想同时（同级）展示多个视图，而不是嵌套展示，例如创建一个布局，有 sidebar（侧导航） 和 main（主内容） 两个视图，这个时候命名视图就派上用场了。你可以在界面中拥有多个单独命名的视图，而不是只有一个单独的出口。如果 router-view 没有设置名字，那么默认为 default。
	`<router-view class="view one"></router-view>
	<router-view class="view two" name="a"></router-view>
	<router-view class="view three" name="b"></router-view>`
一个视图使用一个组件渲染，因此对于同个路由，多个视图就需要多个组件。确保正确使用 components 配置（带上 s）
	`const router = new VueRouter({
	  routes: [
	    {
	      path: '/',
	      components: {
	        default: Foo,
	        a: Bar,
	        b: Baz
	      }
	    }
	  ]
	})`


七、重定向与别名

1. 重定向
重定向也是通过 routes 配置来完成，下面例子是从 /a 重定向到 /b：
	`const router = new VueRouter({
	  routes: [
	    { path: '/a', redirect: '/b' }
	  ]
	})`
甚至是一个方法，动态返回重定向目标：
	`const router = new VueRouter({
	  routes: [
	    { path: '/a', redirect: to => {
	      // 方法接收 目标路由 作为参数
	      // return 重定向的 字符串路径/路径对象
	    }}
	  ]
	})`

2. 别名
『重定向』的意思是，当用户访问 /a时，URL 将会被替换成 /b，然后匹配路由为 /b。
/a 的别名是 /b，意味着，当用户访问 /b 时，URL 会保持为 /b，但是路由匹配则为 /a，就像用户访问 /a 一样。
上面对应的路由配置为：
	`const router = new VueRouter({
	  routes: [
	    { path: '/a', component: A, alias: '/b' }
	  ]
	})`
『别名』的功能让你可以自由地将 UI 结构映射到任意的 URL，而不是受限于配置的嵌套路由结构。