/**
 * 权限的接口封装
 */

import request from '@/utils/request'

/**
 * 获取权限列表
 */
export const getRightsList = type => request({
  method: 'GET',
  url: `/rights/${type}`
}).then(res => res.data)

/**
 * 获取当前登录用户的权限菜单
 */
export const getRightsMenu = () => request({
  method: 'GET',
  url: '/menus'
}).then(res => res.data)
