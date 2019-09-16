<template>
<div class="goods-wrap">
  <!-- 操作选项 -->
  <!--
    数据 | 过滤器函数(参数...)
    数据会作为第一个参数传递给过滤器
    过滤器函数调用中的参数从第2个开始传递
   -->
  <el-row :gutter="20">
    <el-col :span="4">
      <el-input
        v-model="searchText"
        placeholder="请输入内容"
        @keyup.enter.native="loadGoods(1)">
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
    </el-col>
    <el-col :span="4">
      <el-button type="primary" @click="$router.push('/toadd')">添加商品</el-button>
    </el-col>
  </el-row>
  <!-- /操作选项 -->

  <!-- 数据列表 -->
  <el-table
    :data="goods"
    border
    stripe
    style="width: 100%">
    <el-table-column type="index" label="编号" width="80" :index="indexMethod">
    </el-table-column>
    <el-table-column
      prop="goods_name"
      label="商品名称"
      width="180">
    </el-table-column>
    <el-table-column
      prop="goods_price"
      label="商品价格"
      width="180">
    </el-table-column>
    <el-table-column
      prop="goods_state"
      label="商品状态">
    </el-table-column>
    <el-table-column
      prop="goods_weight"
      label="商品重量">
    </el-table-column>
    <el-table-column
      prop="add_time"
      label="创建时间">
      <template slot-scope="scope">{{ scope.row.add_time | dateFormat }}</template>
    </el-table-column>
    <el-table-column
      label="操作">
      <template slot-scope="scope">
        <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
        <el-button type="success" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
      </template>
    </el-table-column>
  </el-table>
  <!-- /数据列表 -->

  <!-- 数据分页 -->
  <!--
    :current-page.sync="page" 分页组件会把当前页面同步到 page 属性
   -->
  <el-pagination
    background
    layout="prev, pager, next"
    :page-size="20"
    :current-page.sync="page"
    @current-change="loadGoods"
    :total="goodsTotal">
  </el-pagination>
  <!-- /数据分页 -->
</div>
</template>

<script>
import { getGoodsList } from '@/api/goods'
import dayjs from 'dayjs' // dayjs 是一个非常轻量的时间处理库，和 moment 的 API 几乎一致

console.log(dayjs(1553743663934).format('YYYY-MM-DD HH:mm:ss'))

export default {
  name: 'GoodsList',
  data () {
    return {
      goods: [],
      goodsTotal: 0,
      searchText: '',
      page: 1
    }
  },

  created () {
    this.loadGoods(1)
  },

  methods: {
    indexMethod (index) {
      // console.log(index)
      // return index + 1
      // (2 - 1) * 20 + 0 + 1 = 21
      // (2 - 1) * 20 + 1 + 1 = 22
      // (2 - 1) * 20 + 2 + 1 = 23
      //
      // (1 - 1) * 20 + 0 + 1 = 1
      // (1 - 1) * 20 + 1 + 1 = 2
      return (this.page - 1) * 20 + index + 1
    },
    async loadGoods (page = 1) {
      const { data, meta } = await getGoodsList({ pagenum: page, query: this.searchText })
      if (meta.status === 200) {
        this.goods = data.goods
        // data.goods.forEach(item => {
        //   item.add_time = dayjs(item.add_time).format('YYYY-MM-DD HH:mm:ss')
        // })
        this.goodsTotal = data.total
      }
    },

    handleDelete () {},

    handleUpdate () {}
  }
}
</script>

<style>
</style>
