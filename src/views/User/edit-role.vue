<template>
  <el-dialog
    title="编辑用户角色"
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
      <el-form-item label="角色" label-width="80px" prop="email">
        <!--
          el-select 会自动让 el-options 的 value 与 editForm.rid 相等的被选中
         -->
        <el-select placeholder="请选择" v-model="editForm.rid">
          <el-option :value="-1" label="请选择"></el-option>
          <el-option
            v-for="item in roles"
            :key="item.id"
            :label="item.roleName"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="fomrVisible = false">取 消</el-button>
      <el-button type="primary" @click.prevent="handleEditRole">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getById as getUserById, updateUserRoleByUserId } from '@/api/user'
import { getRoleList } from '@/api/role'

export default {
  name: 'UserEditRole',
  data () {
    return {
      // roleId: 30,
      fomrVisible: false,
      editForm: {
        username: '',
        email: '',
        mobile: '',
        rid: 0
      },
      roles: [],
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
    async handleEditRole () {
      const { id: userId, rid: roleId } = this.editForm
      const { meta } = await updateUserRoleByUserId(userId, roleId)
      if (meta.status === 200) {
        // 关闭对话框
        this.fomrVisible = false
        this.$message({
          type: 'success',
          message: '分配用户角色成功'
        })
      }
    },

    async showEditRoleDialog (item) {
      const { data, meta } = await getUserById(item.id)
      if (meta.status === 200) {
        this.editForm = data
        this.fomrVisible = true // 显式弹框
      }
      const { data: roleData, meta: roleMeta } = await getRoleList()
      if (roleMeta.status === 200) {
        this.roles = roleData
      }
    }
  },
  filter: {
    // 名字 () {

    // }
  }
}
</script>

<style>
</style>
