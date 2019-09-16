<template>
<el-container>
  <el-header>
    <AppHeader></AppHeader>
  </el-header>
  <el-container>
    <el-aside width="200px">
      <!-- 导航组件 -->
      <NavMenu @menu-select="handleMenuSelect"></NavMenu>
      <!-- /导航组件 -->
    </el-aside>
    <el-main>
      <el-card class="box-card">
        <!-- 卡片头部 -->
        <div slot="header" class="clearfix">
          <!-- 面包屑路径导航组件 -->
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-for="(item, index) in breadNames" :key="index">{{ item }}</el-breadcrumb-item>
            <!-- <el-breadcrumb-item>用户列表</el-breadcrumb-item> -->
          </el-breadcrumb>
          <!-- /面包屑路径导航组件 -->
        </div>
        <!-- Layout 的 children 子路由会展示到这里 -->
        <router-view></router-view>

      </el-card>
    </el-main>
  </el-container>
</el-container>
</template>

<script>
import AppHeader from './header.vue'
import NavMenu from './navmenu.vue'

export default {
  name: 'AppLayout',
  data () {
    return {
      breadNames: []
    }
  },
  methods: {
    handleMenuSelect (names) {
      // console.log(names)
      this.breadNames = names
    }
  },
  components: {
    AppHeader,
    NavMenu
  }
}
</script>

<style scoped>
.el-header {
  background-color: #b3c0d1;
}

.app-header {
  display: flex;
  align-items: center;
}

.el-container {
  height: 100%;
}

.el-aside {
  height: 100%;
  background-color: #d3dce6;
}

.el-submenu .fas {
  margin-right: 5px;
}

.el-main {
  background-color: #e9eef3;
}

.el-menu {
  height: 100%;
}

.el-card {
  /*height: 100%;*/
  min-height: 100%;
}
</style>
