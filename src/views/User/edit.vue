<template>
  <el-dialog
    title="编辑用户"
    :visible.sync="fomrVisible"
    width="40%">
    <el-form
      :model="editForm"
      size="mini"
      label-position="left"
      ref="FormEl"
      :rules="formRules">
      <el-form-item label="用户名" label-width="80px" prop="username">
        <el-input v-model="editForm.username" autocomplete="off" disabled></el-input>
      </el-form-item>
      <el-form-item label="邮箱" label-width="80px" prop="email">
        <el-input v-model="editForm.email" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="电话" label-width="80px" prop="mobile">
        <el-input v-model="editForm.mobile" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="fomrVisible = false">取 消</el-button>
      <el-button type="primary" @click.prevent="handleEdit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getById as getUserById, updateById as updateUserById } from '@/api/user'

export default {
  name: 'UserEdit',
  data () {
    return {
      fomrVisible: false,
      editForm: {
        username: '',
        email: '',
        mobile: ''
      },
      formRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入电话', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleEdit () {
      this.$refs.FormEl.validate(valid => {
        if (!valid) {
          return
        }
        this.submitEdit()
      })
    },

    async submitEdit () {
      const { id, email, mobile } = this.editForm
      const { meta } = await updateUserById(id, {
        email,
        mobile
      })
      if (meta.status === 200) {
        // 更新列表数据
        // 方式一、在当前组件调用父组件方法
        //    不建议，太依赖父组件，
        // 方式二、事件方式，更推荐

        // 为当前组件发布了一个自定义事件
        // 谁要用当前组件，谁就可以去关注这个事件

        // 编辑成功，发布了一个自定义事件
        // 这个事件就表示：编辑成功了
        // 使用这个组件的用户就可以根据自己的需要在编辑成功之后进行其他业务操作
        // 至于其他组件要编辑成功之后干嘛？我当前组件不关心了，
        // 谁来用，谁去决定编辑成功之后
        // 监听子组件事件：https://cn.vuejs.org/v2/guide/components.html#%E7%9B%91%E5%90%AC%E5%AD%90%E7%BB%84%E4%BB%B6%E4%BA%8B%E4%BB%B6
        this.$emit('edit-success')
        // this.$parent 可以直接访问父组件
        this.fomrVisible = false
        this.$message({
          type: 'success',
          message: '更新成功'
        })
      }
    },

    async showEditDialog (item) {
      const { data, meta } = await getUserById(item.id)
      if (meta.status === 200) {
        this.editForm = data
        this.fomrVisible = true // 显式弹框
      }
    }
  }
}
</script>

<style>
</style>
