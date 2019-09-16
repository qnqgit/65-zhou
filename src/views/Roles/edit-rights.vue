<template>
<el-dialog title="角色授权" :visible.sync="dialogFormVisible">
  <!--
    tree 组件
    data 数据
    show-checkbox 是否显式复选框
    node-key 用来指定数据中唯一的标识字段
    default-expanded-keys 默认展开的节点 id
    default-checked-keys 默认选中的节点
    props

    :default-expanded-keys="[2, 3, 4]"
    :default-checked-keys="[5]"
   -->
  <el-tree
    :data="rights"
    ref="tree"
    show-checkbox
    default-expand-all
    :default-checked-keys="defaultChecked"
    node-key="id"
    :props="defaultProps">
  </el-tree>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisible = false">取 消</el-button>
    <el-button type="primary" @click.prevent="handleSubmit">确 定</el-button>
  </div>
</el-dialog>
</template>

<script>
import { getRightsList } from '@/api/rights'
import { updateRightsByRoleId } from '@/api/role'

export default {
  name: 'RoleEditRights',
  data () {
    return {
      dialogFormVisible: false,
      rights: [], // 所有权限列表
      defaultChecked: [], // 默认选中的节点 id 数组
      defaultProps: {
        children: 'children', // 告诉 tree 你的数据中哪个字段是子节点数组
        label: 'authName' // 告诉 tree 你的数据中哪个字段是节点的文本
      },
      role: {}
    }
  },
  methods: {
    showDialog (role) {
      this.role = role
      this.dialogFormVisible = true
      this.loadRights() // 加载所有权限列表
      this.getRights(role.children) // 让角色的拥有的权限在权限树中被选中
    },

    getRights (roleRights) {
      const tmp = []
      roleRights.forEach(first => {
        first.children.forEach(second => {
          // 只需要三级节点的 id 就可以了，因为父级会根据子级自动选中
          second.children.forEach(third => tmp.push(third.id))
        })
      })
      this.defaultChecked = tmp
    },

    async loadRights () {
      const { data, meta } = await getRightsList('tree')
      if (meta.status === 200) {
        this.rights = data
      }
    },

    async handleSubmit () {
      // 获取菜单树中用户选择的节点 id
      const tree = this.$refs.tree
      const rids = [...tree.getCheckedKeys(), ...tree.getHalfCheckedKeys()].join(',')
      const { meta } = await updateRightsByRoleId(this.role.id, rids)
      if (meta.status === 200) {
        this.$emit('edit-rights-success')
        this.dialogFormVisible = false
        this.$message({
          type: 'success',
          message: '授权成功'
        })
      }
    }
  }
}
</script>

<style>
</style>
