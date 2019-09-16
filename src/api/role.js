/**
 * 角色的接口封装
 */
import request from '@/utils/request'

/**
* 获取角色列表
*/
export const getRoleList = () => request({
  method: 'GET',
  url: '/roles'
}).then(res => res.data)

/**
 * 添加角色
 */
export const addRole = ({ roleName, roleDesc }) => request({
  method: 'POST',
  url: '/roles',
  data: {
    roleName,
    roleDesc
  }
}).then(res => res.data)

/**
 * 更新用户权限
 */
export const updateRightsByRoleId = (roleId, rids) => request({
  method: 'POST',
  url: `/roles/${roleId}/rights`,
  data: {
    rids
  }
}).then(res => res.data)

/**
 * 删除角色指定权限
 */
export const deleteRightsByRoleId = (roleId, rightId) => request({
  method: 'DELETE',
  url: `/roles/${roleId}/rights/${rightId}`
}).then(res => res.data)
