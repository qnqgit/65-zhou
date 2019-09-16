<template>
<div class="login-wrap">
  <div class="login-container">
    <!--
      el-form 表单组件
        label-position 设定 label的方向
          left、top、right
      配置表单验证
        1. 为 el-form 组件添加 :rules="loginFromRules" 验证规则
        2. 为 el-form-item 组件添加 prop="验证的字段"
        3. 提交表单的时候获取表单的验证状态（验证通过或者验证失败），根据成功与否进行提交表
          为 el-form 添加 ref="loginFormEl" 值随便起，给的你自己认识就行
          完了在表单提交的时候：
            this.$refs.loginFormEl.validate(valid => {
              // valid 是一个布尔值，表示验证成功与否
            })
     -->
    <el-form
      label-position="top"
      :rules="loginFormRules"
      label-width="80px"
      :model="loginForm"
      ref="loginFormEl">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="loginForm.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="loginForm.password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button class="login-btn" type="primary" @click.prevent="onSubmit">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</div>
</template>

<script>
import { login } from '@/api'
import { setToken } from '@/utils/auth'

export default {
  name: 'AppLogin',
  data () {
    return {
      loginForm: {
        username: '',
        password: ''
      },

      loginFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async onSubmit () {
      this.$refs.loginFormEl.validate(valid => {
        if (valid) { // 验证通过，提交表单
          this.login()
        } else {
          return false
        }
      })
    },

    async login () {
      const { meta, data } = await login(this.loginForm)
      if (meta.status === 200) {
        this.$message({
          message: '登录成功',
          type: 'success'
        })
        // 将用户通过用户名+密码交换到的 token（身份令牌）放到本地存储中，用以在别的地方去使用
        // window.localStorage.setItem('token', data.token)
        setToken(data.token)
        this.$router.replace('/')
      } else {
        this.$message.error(`登录失败：${meta.msg}`)
      }
    }
  }
}
</script>

<style scoped>
  .login-wrap {
    height: 100%;
    background-color: #2f4050;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .login-container {
    width: 500px;
    height: 300px;
    padding: 50px;
    background-color: #fff;
    border-radius: 10px;
  }

  .login-btn {
    width: 100%;
  }
</style>
