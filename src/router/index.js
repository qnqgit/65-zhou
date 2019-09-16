import Vue from 'vue'
import Router from 'vue-router'
import { getToken } from '@/utils/auth'

import Login from '@/views/Login'
import Layout from '@/views/Layout'
import Home from '@/views/Home'
import UserList from '@/views/User'
import RightsList from '@/views/Rights'
import RolesList from '@/views/Roles'
import GoodsList from '@/views/Goods'
import GoodsAdd from '@/views/Goods/add'
import GoodsCategory from '@/views/GoodsCategory'
import OrderList from '@/views/Orders'
import EchartsDemo from '@/views/EchartsDemo'

Vue.use(Router)

/**
 * 关于路由路径的设计，因为涉及到后端给出权限菜单前端需要遍历的情况
 * 所以路由路径的设计需要前后端协商完成
 * 包括：
 *   导航的路径 协商
 *   导航的名字 协商
 *   导航的图标 协商
 *   icon: class类名
 *
 * 工作中就找后端要就可以了
 */

const router = new Router({
  routes: [
    { path: '/login', component: Login }, // 展示到 App.vue 的 router-view 中
    {
      path: '/', // Layout 显式到 App.vue 的 router-view 中
      component: Layout,
      children: [ // 嵌套路由：https://router.vuejs.org/zh/guide/essentials/nested-routes.html
        // 展示 /home 的时候，先展示父路由视图，然后子路由视图展示到父路由的 router-view 出口中
        { path: '', component: Home }, // 请求父路由路径的时候，默认渲染 path 为空的这个子路由
        { path: '/users', component: UserList },
        { path: '/rights', component: RightsList },
        { path: '/roles', component: RolesList },
        { path: '/goods', component: GoodsList },
        { path: '/toadd', component: GoodsAdd },
        { path: '/categories', component: GoodsCategory },
        { path: '/orders', component: OrderList },
        { path: '/echarts', component: EchartsDemo }
      ]
    }
  ]
})

/**
 * to 去哪儿
 * from 来自哪里
 * next 放行规则
 */
router.beforeEach((to, from, next) => {
  console.log('1. 先进入路由导航，校验是否有 token')
  // 如果路由路径是 /login ，则直接允许通过
  if (to.path === '/login') {
    return next()
  }

  // 否则校验登录状态
  // const token = window.localStorage.getItem('token')
  const token = getToken()

  //   如果没有登录，跳转到登录页
  if (!token) {
    return next('/login')
  }

  // 如果有 token，则校验 token 的有效性
  // token 是服务器签发生成的，客户端肯定没法校验它的有效性
  // 所以最好是有一个接口能处理这个需求
  // 但是我们这里没有这样的单独的接口，我们也不需要
  // 因为几乎每个页面都有请求，
  // 例如用户列表需要请求用户列表数据，角色列表需要请求角色列表数据
  // 而这些接口（除了登录接口）都需要提供 token 身份令牌
  // 在请求这些接口的时候，服务器会校验你的 token 的有效性
  // 如果 token 无效，服务端会返回 meta 中 status 为 401 的提示码
  // 我们就可以判断接口的响应结果中 meta.status === 401 从而来决定 token 无效的处理

  //   如果登录了，允许通过
  next()
})

export default router
