/**
 * 1. 在 views 中创建视图组件
 * 2. 在 router 中配置路由导航
 * 3. 使用 element 布局
 * 4. 编写 api 请求函数
 * 5. 调用请求函数，按到结果，渲染到页面中
 */

<template>
<el-table
  :data="rights"
  border
  stripe
  style="width: 100%">
  <el-table-column type="index"></el-table-column>
  <el-table-column
    prop="authName"
    label="权限名称"
    width="180">
  </el-table-column>
  <el-table-column
    prop="path"
    label="路径"
    width="180">
  </el-table-column>
  <el-table-column
    label="层级">
    <template slot-scope="scope">
      {{ ['一级', '二级', '三级'][scope.row.level] }}
    </template>
  </el-table-column>
</el-table>
</template>

<script>
import { getRightsList } from '@/api/rights'

export default {
  name: 'RightsList',
  data () {
    return {
      rights: []
    }
  },

  created () {
    this.loadRights()
  },

  methods: {
    async loadRights () {
      const { meta, data } = await getRightsList('list')
      if (meta.status === 200) {
        this.rights = data
      }
    }
  }
}
</script>

<style>
</style>
