/**
 * 用户的接口封装
 */
import request from '@/utils/request'

/**
 * 获取用户列表
 */
export const getUserList = ({ pagenum = 1, pagesize = 5, query = '' }) => request({ // const { pagenum = 1, pagesize = 5 } = 你传递的那个对象
  method: 'GET',
  url: '/users',
  params: { // 传递 GET 参数
    pagenum,
    pagesize,
    query // query 字段用于模糊查询用户名
  }
}).then(res => res.data)

/**
 * 添加用户
 */
export const addUser = ({ username, password, email, mobile }) => request({
  method: 'POST',
  url: '/users',
  data: {
    username,
    password,
    email,
    mobile
  }
}).then(res => res.data)

/**
 * 修改用户状态
 */
export const changeState = (id, state) => request({
  method: 'PUT',
  url: `/users/${id}/state/${state}`
}).then(res => res.data)

/**
 * 根据 id 删除用户
 */
export const deleteById = id => request({
  method: 'DELETE',
  url: `/users/${id}`
}).then(res => res.data)

/**
 * 根据 id 查询用户信息
 */
export const getById = id => request({
  method: 'GET',
  url: `/users/${id}`
}).then(res => res.data)

/**
 * 根据 id 修改用户基本信息
 */
export const updateById = (id, data) => request({
  method: 'PUT',
  url: `/users/${id}`,
  data: { // PUT 请求体和 POST 一样
    email: data.email,
    mobile: data.mobile
  }
}).then(res => res.data)

/**
 * 根据用户 id 修改用户角色
 */
export const updateUserRoleByUserId = (userId, roleId) => request({
  method: 'PUT',
  url: `/users/${userId}/role`,
  data: { // PUT 请求体和 POST 一样
    rid: roleId
  }
}).then(res => res.data)
