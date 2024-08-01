<template>
  <div class="login-container">
    <el-row>
      <el-col :lg="16" :md="12" :sm="24" :xl="16" :xs="24">
        <div style="color: transparent">占位符</div>
      </el-col>
      <el-col :lg="8" :md="12" :sm="24" :xl="8" :xs="24">

    <el-form ref="registerForm" :model="registerForm" :rules="registerRules" class="login-form" label-position="left">

      <div class="title-container">
        <h3 class="title">注册</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input ref="username" v-model="registerForm.username" placeholder="用户名" name="username" type="text" />
      </el-form-item>

      <el-form-item prop="email">
        <span class="svg-container" style="font-size: 20px;">
          <svg-icon icon-class="email" />
        </span>
        <el-input ref="email" v-model="registerForm.email" placeholder="邮箱" name="email" type="text" />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input :key="passwordType" ref="password" v-model="registerForm.password" :type="passwordType"
          placeholder="密码" name="password" />
      </el-form-item>

      <el-form-item prop="confirm_password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input :key="passwordType" ref="confirm_password" v-model="registerForm.confirm_password"
          :type="passwordType" placeholder="确认密码" name="confirm_password" />
      </el-form-item>

      <el-button :loading="loading" type="primary" class="login-btn"
        @click.native.prevent="handleRegister">注册</el-button>
      <div><el-button type="text" @click="toLogin" style="margin-top: 20px;">登录</el-button></div>

    </el-form>
</el-col>
    </el-row>
  </div>
</template>

<script>
import { encrypt } from '@/utils/crypto'
import { Message } from 'element-ui';
import { register } from '@/api/user'

export default {
  name: 'Register',
  data() {
    const validateConfirmPassword = (rule, value, callback) => {
      if (value == "") {
        callback(new Error('请输入确认密码'))
      } else if (value != this.registerForm.password) {
        callback(new Error("两次输入的密码不一致"))
      } else {
        callback()
      }
    }
    return {

      registerForm: {
        username: "",
        password: "",
        confirm_password: "",
        email: "",
      },
      registerRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '密码长度为6~15', trigger: 'blur' }
        ],
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 10, message: '用户名长度为2~10', trigger: 'blur' }
        ],
        confirm_password: [{ required: true, trigger: 'blur', validator: validateConfirmPassword }],
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined,
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },

    toLogin() {
      this.$router.push({ path: this.redirect || '/login' })
    },
    handleRegister() {
      this.$refs.registerForm.validate(valid => {
        if (valid) {
          this.loading = true
          console.log("register")
          let params = { ...this.registerForm }
          params.password = encrypt(params.password)
          params.confirm_password = encrypt(params.confirm_password)

          register(params).then(() => {
            this.loading = false
            Message({
              message: '恭喜您注册成功，请登录',
              type: 'success',
              duration: 5000
            })
            this.toLogin()

          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;
$base-font-color:#606266;
$base-input-height: 32px;
$base-font-size-small: 12px;
$base-color-red: #f34d37;
$base-font-size-default: 14px;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-form-item {
        padding-right: 0;
        margin: 20px 0;
        color: #454545;
        background: transparent;
        border: 1px solid transparent;
        border-radius: 2px;

        &__content {
          min-height: $base-input-height;
          line-height: $base-input-height;
        }

        &__error {
          position: absolute;
          top: 100%;
          left: 18px;
          font-size: $base-font-size-small;
          line-height: 18px;
          color: $base-color-red;
        }
  }
  .el-input {
        box-sizing: border-box;

        input {
          height: 58px;
          // margin-left: 30px;
          padding-left: 45px;
          font-size: $base-font-size-default;
          line-height: 58px;
          color: $base-font-color;
          background: #f6f4fc;
          border: 0;
          caret-color: $base-font-color;
        }
      }
    }
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  height: 100vh;
  background: url('~@/assets/background/login_background.jpg') center center fixed no-repeat;
  background-size: cover;

  .login-form {
      position: relative;
      max-width: 100%;
      margin: calc((100vh - 599px) / 2) 10% 10%;
      overflow: hidden;
  }

  .tips {
    font-size: 54px;
      font-weight: 500;
      color: rgba(14, 18, 26, 1);

  }

  .svg-container {
    position: absolute;
      top: 14px;
      left: 15px;
      z-index: 999;
      font-size: 16px;
      color: #c5cbce;
      cursor: pointer;
      user-select: none;
  }

  .title-container {

    .title {
      font-size: 54px;
      font-weight: 500;
      color: rgba(14, 18, 26, 1);
    }
    .title-tips {
      margin-top: -20px;
      margin-bottom: 10px;
      font-size: 26px;
      font-weight: 400;
      color: rgba(14, 18, 26, 1);
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .show-pwd {
    position: absolute;
      top: 14px;
      right: 25px;
      font-size: 16px;
      color: #a0a5a8;
      cursor: pointer;
      user-select: none;
  }

  .login-btn {
    display: inherit;
      width: 220px;
      height: 60px;
      margin-top: 5px;
      border: 0;

      &:hover {
        opacity: 0.9;
      }
  }
}
</style>