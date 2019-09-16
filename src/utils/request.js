/**
 * 封装的 axios 请求模块
 */

import axios from 'axios'
import router from '@/router'
import { getToken } from '@/utils/auth'

// axios 可以配置基础路径，这样的话就不需要每次请求的时候都写那么长的路径了
// 最简单的方式就像这样，但是不推荐
// 因为当你有多个不同的请求接口路径的时候
// axios.defaults.baseURL = 'https://api.example.com'

// 我建议的方式就是调用 create 方法创建一个 axios 实例
// axios 实例拥有和 axios 一模一样的功能
// 好处就是我们可以针对不同 url 的接口创建多个 axios 实例
const http = axios.create({
  baseURL: 'http://localhost:8888/api/private/v1/'
})

/**
 * axios 请求拦截器
 * 所有使用 axios 发起的请求都会经过这里
 * 我们可以在这里定制一些业务逻辑，例如统一给需要授权的 API 加 token
 */
// Add a request interceptor
http.interceptors.request.use(function (config) {
  console.log('3. 请求经过请求拦截器，这里统一的加 token')
  if (config.url !== '/login') {
    // config.headers.Authorization = window.localStorage.getItem('token')
    config.headers.Authorization = getToken()
  }
  // Do something before request is sent
  return config // 请求通过的规则，如果不 return config，则请求不会发出去
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})

/**
 * axios 响应拦截器
 * 所有请求收到的响应结果都会经过这里
 * 我们可以在这里做业务逻辑处理
 * 例如统一判断 meta.status === 401 跳转登录页
 */
http.interceptors.response.use(function (response) {
  console.log('4. 响应回来先经过响应拦截器，这里判断响应码是否为 401')
  if (response.data.meta.status === 401) {
    // 跳转到登录页
    // 组件的 this.$router 就是 router/index.js 中 new VueRouter 实例
    router.replace('/login')
  }
  // Do something with response data
  return response // 这里 return 的 response 会作为你真正的响应结果
}, function (error) {
  // Do something with response error
  return Promise.reject(error)
})

export default http
