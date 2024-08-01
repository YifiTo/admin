<template>
  <div class="login-container">

    <el-row>
      <el-col :lg="16" :md="12" :sm="24" :xl="16" :xs="24">
        <div style="color: transparent">占位符</div>
      </el-col>
      <el-col :lg="8" :md="12" :sm="24" :xl="8" :xs="24">
        <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" label-position="left">

          <div class="title-container">
            <h3 class="title">登录</h3>
            <div class="title-tips">欢迎来到yihui的平台！</div>
          </div>

          <el-form-item prop="email">
            <span class="svg-container">
              <svg-icon icon-class="email" style="font-size: 20px"/>
            </span>
            <el-input ref="email" v-model="loginForm.email" placeholder="邮箱" name="email" type="text" />
          </el-form-item>

          <el-form-item prop="password">
            <span class="svg-container">
              <svg-icon icon-class="password" style="font-size: 15px" />
            </span>
            <el-input :key="passwordType" ref="password" v-model="loginForm.password" :type="passwordType"
              placeholder="密码" name="password" @keyup.enter.native="handleLogin" />
            <span class="show-pwd" @click="showPwd">
              <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
            </span>
          </el-form-item>

          <el-button :loading="loading" type="primary" class="login-btn"
            @click.native.prevent="handleLogin">登录</el-button>
          <div><el-button type="text" @click="toRegister" style="margin-top: 20px;">注册</el-button></div>

        </el-form>

      </el-col>
    </el-row>
  </div>
</template>

<script>
import { encrypt } from '@/utils/crypto'
export default {
  name: "Login",
  data() {
    return {
      loginForm: {
        email: '',
        password: ''
      },
      loginRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '密码至少6个字符', trigger: 'blur' }
        ]
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

    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          let params = { ...this.loginForm }
          params.password = encrypt(params.password)
          this.$store.dispatch('user/login', params).then(() => {
            this.$router.push({ path: this.redirect || '/' })
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },

    toRegister() {
      this.$router.push({ path: '/register' })
    },

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
      margin: calc((100vh - 425px) / 2) 10% 10%;
      overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
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
      margin-top: 10px;
      border: 0;

      &:hover {
        opacity: 0.9;
      }
  }
}
</style>
