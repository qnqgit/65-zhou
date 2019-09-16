<template>
<el-menu
  :default-active="$route.path"
  class="el-menu-vertical-demo"
  @open="handleOpen"
  @close="handleClose"
  @select="handleMenuSelect"
  :router="true">
  <el-submenu :index="first.path" v-for="first in menus" :key="first.id">
    <template slot="title">
      <!-- <i class="el-icon-location"></i> -->
      <i class="fas fa-user fa-lg"></i>
      <span>{{ first.authName }}</span>
    </template>
    <el-menu-item :index="`/${second.path}`" v-for="second in first.children" :key="second.id">
      <template slot="title">
        <i class="el-icon-info"></i>
        <span>{{ second.authName }}</span>
      </template>
    </el-menu-item>
  </el-submenu>
<!--   <el-submenu index="2">
    <template slot="title">
      <i class="el-icon-location"></i>
      <span>权限管理</span>
    </template>
    <el-menu-item index="/roles">
      <template slot="title">
        <i class="el-icon-location"></i>
        <span>角色列表</span>
      </template>
    </el-menu-item>
    <el-menu-item index="/rights">
      <template slot="title">
        <i class="el-icon-location"></i>
        <span>权限列表</span>
      </template>
    </el-menu-item>
  </el-submenu>
  <el-submenu index="3">
    <template slot="title">
      <i class="el-icon-location"></i>
      <span>商品管理</span>
    </template>
    <el-menu-item-group>
      <el-menu-item index="3-1">商品列表</el-menu-item>
    </el-menu-item-group>
    <el-menu-item-group>
      <el-menu-item index="3-2">分类参数</el-menu-item>
    </el-menu-item-group>
    <el-menu-item-group>
      <el-menu-item index="3-2">商品分类</el-menu-item>
    </el-menu-item-group>
  </el-submenu>
  <el-submenu index="4">
    <template slot="title">
      <i class="el-icon-location"></i>
      <span>订单管理</span>
    </template>
    <el-menu-item-group>
      <el-menu-item index="4-1">订单列表</el-menu-item>
    </el-menu-item-group>
  </el-submenu>
  <el-submenu index="5">
    <template slot="title">
      <i class="el-icon-location"></i>
      <span>数据统计</span>
    </template>
    <el-menu-item-group>
      <el-menu-item index="5-1">数据报表</el-menu-item>
    </el-menu-item-group>
  </el-submenu> -->
</el-menu>
</template>

<script>
import { getRightsMenu } from '@/api/rights'

export default {
  name: 'NavMenu',
  data () {
    return {
      menus: []
    }
  },
  async created () {
    await this.loadRightsMenu()
    // console.log(this.$route)

    // 默认一上来就手动的 select 一下
    // 路径来自于路由路径
    this.handleMenuSelect(this.$route.path)
  },
  methods: {
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    },
    async loadRightsMenu () {
      const { data, meta } = await getRightsMenu()
      if (meta.status === 200) {
        this.menus = data
      }
    },
    handleMenuSelect (index) {
      const secondPath = index.substr(1)
      // 根据二级路径找到一级
      this.menus.forEach(first => {

        // find 会遍历数据，将符合 second.path === secondPath 条件的元素返回
        const second = first.children.find(second => {
          return second.path === secondPath
        })

        if (second) { // 如果找到 second
          // console.log(first.authName, second.authName)
          this.$emit('menu-select', [first.authName, second.authName])
        }
      })
    }
  }
}
</script>

<style>
</style>
