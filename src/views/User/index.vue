<template>
<div>
  <!-- 操作选项 -->
  <el-row :gutter="20">
    <el-col :span="4">
      <!--
        el-input 是一个组件，无法直接监听原生的 click、keyup 等事件
        如果需要监听，则必须使用 .native 修饰符
        .native 修饰符监听组件根元素的原生事件

        注意：这里将 loadUsers 作为原生事件的处理函数，一定要记得手动调用传 1，第 1 页数据
        否则 loadUsers 的第1个参数就是事件源对象，把事件源对象当成页码去请求数据就是有问题的
       -->
      <el-input
        placeholder="请输入内容"
        v-model="searchText"
        @keyup.enter.native="loadUsers(1)">
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
    </el-col>
    <el-col :span="4">
      <el-button type="primary" @click="addFormVisible = true">添加用户</el-button>
    </el-col>
  </el-row>
  <!-- /操作选项 -->

  <!-- /卡片头部 -->
  <!-- 卡片内容 -->

  <!--
    表格组件
    data 是表格的数据
    stripe 斑马纹
    border 带边框
    el-table-column 表格列组件
      你只需要设计表格列：列名+列值
      label 列名
      prop 数据名
      width 列宽，默认 px
    它内部会自动去遍历 data 数据，循环生成表格列
    v-loading 是 element-ui 扩展的一个自定义指令，用于添加 loading 加载效果
  -->
  <el-table
    :data="users"
    stripe
    border
    v-loading="tableLoading"
    style="width: 100%">
    <el-table-column
      type="index">
    </el-table-column>
    <el-table-column
      prop="username"
      label="姓名"
      width="180">
    </el-table-column>
    <el-table-column
      prop="email"
      label="邮箱"
      width="180">
    </el-table-column>
    <el-table-column
      prop="mobile"
      label="电话">
    </el-table-column>
    <el-table-column label="用户状态">
      <template slot-scope="scope">
        <el-switch
          v-model="scope.row.mg_state"
          @change="handleChangeState(scope.row)"
          active-color="#13ce66"
          inactive-color="#ff4949">
        </el-switch>
      </template>
    </el-table-column>
    <!--
      自定义表格列
      1. 自定义内容写到 <template slot-scope="scope"></template>
         slot-scope 是固定的属性
         值 "scope" 是随便起的一个名字
         在 template 中，scope.row 用于获取当前遍历项（item）
         scope.$index 就是遍历的索引
     -->
    <el-table-column label="操作">
      <template slot-scope="scope">
        <el-button
          size="mini"
          @click="$refs.userEditEl.showEditDialog(scope.row)">编辑</el-button>
        <el-button
          size="mini"
          type="danger"
          @click="handleDelete(scope.row)">删除</el-button>
        <el-button
          type="success"
          icon="el-icon-check"
          size="mini"
          @click="$refs.userEditRoleEl.showEditRoleDialog(scope.row)">分类角色</el-button>
      </template>
    </el-table-column>
  </el-table>
  <!-- /表格组件 -->

  <!--
    分页组件 el-pagination
    background 带有背景色
    layout 分页结构，prev 显示上一页，pager next 下一页
    total 数据总条数
    默认按照 10 条每页进行分页
    current-change 页码改变会触发该事件
  -->
  <el-pagination
    background
    layout="prev, pager, next"
    :total="total"
    @current-change="loadUsers"
    :page-size="5"
    :current-page.sync="page">
  </el-pagination>
  <!-- /分页组件 -->

  <!--
  添加用户对话框
  title 对话框标题
  visible 布尔值，对话框是否显示
  -->
  <el-dialog
    title="添加用户"
    :visible.sync="addFormVisible"
    width="40%">
    <el-form
      :model="addFromData"
      size="mini"
      label-position="left"
      ref="addFormEl"
      :rules="addFormRules">
      <el-form-item label="用户名" label-width="80px" prop="username">
        <el-input v-model="addFromData.username" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="密码" label-width="80px" prop="password">
        <el-input v-model="addFromData.password" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" label-width="80px" prop="email">
        <el-input v-model="addFromData.email" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="电话" label-width="80px" prop="mobile">
        <el-input v-model="addFromData.mobile" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="addFormVisible = false">取 消</el-button>
      <el-button type="primary" @click.prevent="handleAdd">确 定</el-button>
    </div>
  </el-dialog>
  <!-- /添加用户对话框 -->

  <!-- 编辑用户对话框 -->
  <!--
    1. 为组件添加一个 ref 属性，起个名字
    2. 然后就可以在当前组件中通过 this.$refs.组件的ref名字 来访问到这个组件了
    this.$refs.userEditEl 可以直接访问到 UserEdit 组件
   -->
  <UserEdit ref="userEditEl" v-on:edit-success="loadUsers"></UserEdit>
  <!-- /编辑用户对话框 -->

  <!-- 编辑用户角色组件 -->
  <UserEditRole ref="userEditRoleEl"></UserEditRole>
  <!-- /编辑用户角色组件 -->
</div>
</template>

<script>
// import { getUserList, addUser } from '@/api/user'
import * as User from '@/api/user'
import UserEdit from './edit'
import UserEditRole from './edit-role'

export default {
  name: 'UserList',
  components: {
    UserEdit,
    UserEditRole
  },
  data () {
    return {
      users: [],
      searchText: '',
      addFormVisible: false, // 对话框是否显示
      addFromData: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      tableLoading: true,
      addFormRules: {
        username: [
          { required: true, message: '请输入邮箱', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入电话', trigger: 'blur' }
        ]
      },
      total: 0,
      page: 1
    }
  },
  async created () {
    console.log('2. token 存在，进入了具体的业务组件')
    // 除了登录接口，其它接口都需要身份令牌才能访问
    // 所有需要授权（提供 token）的接口都需要像下面这样来写
    this.loadUsers()
  },
  methods: {
    async loadUsers (page = 1) {
      this.tableLoading = true // 开始加载 loading 效果
      const { data } = await User.getUserList({ pagenum: page, pagesize: 5, query: this.searchText })
      this.users = data.users
      this.total = data.total
      this.tableLoading = false // 取消 loading 效果
    },
    handleAdd () {
      this.$refs.addFormEl.validate(valid => {
        if (!valid) { // 验证失败，什么都不做
          return
        }
        this.submitAdd() // 验证通过，提交表单
      })
    },
    async submitAdd () {
      const { meta } = await User.addUser(this.addFromData)
      if (meta.status === 201) {
        this.$refs.addFormEl.resetFields() // 清空表单数据
        this.addFormVisible = false // 隐藏对话框
        this.loadUsers() // 重新加载用户数据列表
      }
    },

    handleEdit () {},

    handleDelete (item) {
      this.$confirm('确认删除吗？', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => { // 确认
        const { meta } = await User.deleteById(item.id)
        if (meta.status === 200) {
          this.$message({
            type: 'success',
            message: '删除成功！'
          })

          // this.page 就是当前页面
          // 当前页面会和分页组件的页码保持同步
          this.loadUsers(this.page)
        }
      }).catch((err) => { // 取消
        console.log(err)
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },

    async handleChangeState (item) {
      const { meta, data } = await User.changeState(item.id, item.mg_state)
      if (meta.status === 200) {
        this.$message({
          type: 'success',
          message: `${data.mg_state ? '启用' : '禁用'}用户状态成功`
        })
      }
    }
  }
}
</script>

<style scoped>
.el-table {
  margin-top: 15px;
}

.el-pagination {
  margin-top: 15px;
}
</style>
