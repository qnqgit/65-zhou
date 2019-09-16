<template>
<el-dialog title="添加分类" :visible.sync="dialogFormVisible">
  <el-form :model="form">
    <el-form-item label="分类名称" label-width="100px">
      <el-input v-model="form.cat_name" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="父级分类" label-width="100px">
      <el-cascader
        change-on-select
        clearable
        :options="goodsCategories"
        :props="{
          value: 'cat_id',
          label: 'cat_name',
          children: 'children'
        }"
        v-model="form.cat_pid">
      </el-cascader>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="handleSubmit">确 定</el-button>
  </div>
</el-dialog>
</template>

<script>
import { getGoodsCategoryList, addGoodsCategory } from '@/api/goods-category'

export default {
  name: 'GoodsCategoryAdd',
  data () {
    return {
      dialogFormVisible: false,
      form: {
        cat_pid: [], // cascader 会把选中的节点存储到该数组中
        cat_name: '', // 分类名称
        cat_level: '' // 分类级别
      },
      goodsCategories: []
    }
  },

  created () {
    this.loadGoodsCategories()
  },

  methods: {
    show () {
      this.dialogFormVisible = true
    },

    async loadGoodsCategories () {
      const { data, meta } = await getGoodsCategoryList(2) // 只加载包含2级的商品分类
      if (meta.status === 200) {
        this.goodsCategories = data
      }
    },

    async handleSubmit () {
      const { cat_pid, cat_name, cat_level } = this.form

      const { data, meta } = await addGoodsCategory({
        cat_name,
        cat_pid: cat_pid[cat_pid.length - 1] || 0,
        cat_level: cat_pid.length // 0 是一级、1 是 二级、2 是三级
      })

      if (meta.status === 201) {
        this.dialogFormVisible = false
        this.$emit('add-success')
        this.$message({
          type: 'success',
          message: '添加成功'
        })
      }
    }
  }
}
</script>

<style>
</style>
