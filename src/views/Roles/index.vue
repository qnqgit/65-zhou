/**
 * 1. 在 views 中创建视图组件
 * 2. 在 router 中配置路由导航
 * 3. 使用 element 布局
 * 4. 编写 api 请求函数
 * 5. 调用请求函数，按到结果，渲染到页面中
 */
<template>
<div>
  <el-row>
    <el-col :span="4">
      <!--
        这里有个大问题：调用子组件方法先必须调用一下，有问题
       -->
      <!-- <el-button type="primary" @click="handleAdd">添加角色</el-button> -->

      <!-- 模板中访问$refs成员方法，一定要调用 -->
      <!-- 官方文档说进来不要在模板中使用 $refs -->
      <!-- <el-button type="primary" @click="$refs.roleAddEl.showDialog()">添加角色</el-button> -->

      <!-- 这是 hack 的一种方式，直接给事件绑定了一个匿名箭头函数 -->
      <el-button type="primary" @click="() => this.$refs.roleAddEl.showDialog()">添加角色</el-button>
    </el-col>
  </el-row>

  <!-- 角色列表 -->
  <!--
    Error in callback for watcher "data": "Error: if there's nested data, rowKey is required."
    2.7 版本中升级了一个新的功能：支持表格树
    当你使用表格的时候，表格组件会自动检查你的数据是否是嵌套数据（树结构），从而自动进行表格树渲染
    它的依据就是你的数据中的子节点名字：children
    也就是说它发现你的数据是树结构数据，所以它要按照表格树的方式进行渲染
    如果要渲染成表格树，它需要提供 row-key

    目前它不支持手动配置表格树的渲染，它自作多情的要给你渲染成表格树
    解决方案：将你数据中的字段 children 改个名字就可以
   -->
  <el-table
    :data="roles"
    border
    stripe
    style="width: 100%">
    <el-table-column type="expand">
      <template slot-scope="scope">
        <el-row class="first" v-for="first in scope.row.rights" :key="first.id">
          <!-- 一级 -->
          <el-col :span="4">
            <el-tag closable @close="handleDeleteRights(scope.row, first)">{{ first.authName }}</el-tag>
            <i class="el-icon-arrow-right"></i>
          </el-col>

          <!-- 二级 -->
          <el-col :span="20">
            <el-row class="second" v-for="second in first.children" :key="second.id">
              <el-col :span="4">
                <el-tag closable type="success" @close="handleDeleteRights(scope.row, second)">{{ second.authName }}</el-tag>
                <i class="el-icon-arrow-right"></i>
              </el-col>

              <!-- 三级 -->
              <el-col :span="20">
                <el-tag
                  class="third"
                  v-for="third in second.children"
                  :key="third.id"
                  closable
                  type="warning"
                  @close="handleDeleteRights(scope.row, third)">{{ third.authName }}</el-tag>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </template>
    </el-table-column>
    <el-table-column type="index"></el-table-column>
    <el-table-column
      prop="roleName"
      label="角色名称"
      width="180">
    </el-table-column>
    <el-table-column
      prop="roleDesc"
      label="描述"
      width="180">
    </el-table-column>
    <el-table-column label="操作">
      <template slot-scope="scope">
        <el-button
          size="mini"
          @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
        <el-button
          size="mini"
          type="danger"
          @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        <el-button
          size="mini"
          type="warning"
          @click="showEditRights(scope.row)">授权角色</el-button>
      </template>
    </el-table-column>
  </el-table>
  <!-- /角色列表 -->

  <!-- 添加角色 -->
  <RoleAdd ref="roleAddEl" @add-success="loadRoles" />
  <!-- /添加角色 -->

  <!-- 角色授权 -->
  <RoleEditRights ref="roleEditRightsEl" @edit-rights-success="loadRoles" />
  <!-- /角色授权 -->
</div>
</template>

<script>
import { getRoleList, deleteRightsByRoleId } from '@/api/role'
import RoleAdd from './add'
import RoleEditRights from './edit-rights'

export default {
  name: 'RolesList',
  components: {
    RoleAdd,
    RoleEditRights
  },
  data () {
    return {
      roles: []
    }
  },
  created () {
    this.loadRoles()
  },
  methods: {
    async loadRoles () {
      const { data, meta } = await getRoleList()
      if (meta.status === 200) {
        data.forEach(item => {
          item.rights = item.children
          delete item.children // 删除 children
        })
        this.roles = data
      }
    },
    handleEdit () {},
    handleDelete () {},
    handleAdd () {
      this.$refs.roleAddEl.showDialog()
    },
    showEditRights (item) {
      this.$refs.roleEditRightsEl.showDialog(item)
    },

    async handleDeleteRights (role, right) {
      const { data, meta } = await deleteRightsByRoleId(role.id, right.id)
      if (meta.status === 200) {
        // 删除接口会返回该用户的最新的权限列表，我们可以直接把这个 data 赋值给当前角色的权限列表
        role.children = data
        // this.loadRoles()
      }
    }
  }
}
</script>

<style scoped>
.el-table {
  margin-top: 15px;
}

.first {
  margin-bottom: 10px;
}

.second, .third {
  margin-top: 5px;
}

.third {
  margin-right: 5px;
}
</style>
