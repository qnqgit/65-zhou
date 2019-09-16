<template>
<el-row class="app-header">
  <el-col :span="4">
    <img src="./logo.png" alt="黑马程序员">
  </el-col>
  <el-col :span="16">
    黑马程序员
  </el-col>
  <el-col :span="4">
    <el-button type="primary" @click="hadleLogout">退出</el-button>
  </el-col>
</el-row>
</template>

<script>
import { removeToken } from '@/utils/auth'

export default {
  name: 'AppHeader',
  data () {
    return {}
  },
  methods: {
    hadleLogout () {
      this.$confirm('确认退出吗？', '退出提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => { // 确认
        // 1. 清空登录状态 token
        // window.localStorage.removeItem('token')
        removeToken()
        // 2. 跳转到登录页
        this.$router.replace('/login')
        this.$message({
          type: 'success',
          message: '退出成功！'
        })
      }).catch((err) => { // 取消
        console.log(err)
        this.$message({
          type: 'info',
          message: '已取消退出'
        })
      })
    }
  }
}
</script>

<style>
</style>
