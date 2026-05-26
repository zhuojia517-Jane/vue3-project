<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/userStore.js'
import { getMobileCodeAPI } from '@/apis/user'
import { ElMessage } from 'element-plus'
import 'element-plus/theme-chalk/el-message.css'
import { useRouter } from 'vue-router'
const userStore = useUserStore()
const formRef = ref(null)
const router = useRouter()

const activeTab = ref('account')

const form = ref({
  account: '',
  password: '',
  agree: true
})

const rules = {
  account: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 24, message: '长度在 6 到 24 个字符', trigger: 'blur' }
  ],
  agree: [
    {
      validator(rule, value, callback) {
        if (value) callback()
        else callback(new Error('请同意隐私条款和服务条款'))
      }
    }
  ]
}

const doLogin = () => {
  const { account, password } = form.value
  formRef.value.validate(async (valid) => {
    if (!valid) return
    await userStore.getUserInfo({ account, password })
    ElMessage({ type: 'success', message: '登录成功' })
    router.replace({ path: '/' })
  })
}

const mobile = ref('')
const code = ref('')
const codeSending = ref(false)
const countdown = ref(0)
let timer = null

const canSendCode = computed(() => {
  return /^1\d{10}$/.test(mobile.value) && !codeSending.value && countdown.value === 0
})

const sendCode = async () => {
  if (!canSendCode.value) return
  codeSending.value = true
  try {
    await getMobileCodeAPI(mobile.value)
    ElMessage.success('验证码已发送')
    countdown.value = 60
    timer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        clearInterval(timer)
        timer = null
      }
    }, 1000)
  } catch {
    // http interceptor handles
  } finally {
    codeSending.value = false
  }
}

const doMobileLogin = async () => {
  if (!/^1\d{10}$/.test(mobile.value)) {
    ElMessage.warning('请输入正确的手机号')
    return
  }
  if (!code.value) {
    ElMessage.warning('请输入验证码')
    return
  }
  await userStore.loginByMobile({ mobile: mobile.value, code: code.value })
  ElMessage({ type: 'success', message: '登录成功' })
  router.replace({ path: '/' })
}
</script>


<template>
  <div>
    <header class="login-header">
      <div class="container m-top-20">
        <h1 class="logo">
          <RouterLink to="/">小兔鲜</RouterLink>
        </h1>
        <RouterLink class="entry" to="/">
          进入网站首页
          <i class="iconfont icon-angle-right"></i>
          <i class="iconfont icon-angle-right"></i>
        </RouterLink>
      </div>
    </header>
    <section class="login-section">
      <picture class="login-bg">
        <source srcset="@/assets/images/login-bg.webp" type="image/webp">
        <img src="@/assets/images/login-bg.png" alt="">
      </picture>
      <div class="wrapper">
        <nav>
          <a href="javascript:;" :class="{ active: activeTab === 'account' }" @click="activeTab = 'account'">账户登录</a>
          <a href="javascript:;" :class="{ active: activeTab === 'sms' }" @click="activeTab = 'sms'">短信登录</a>
        </nav>
        <div class="account-box">
          <!-- 账户密码登录 -->
          <div class="form" v-if="activeTab === 'account'">
            <el-form ref="formRef" :model="form" :rules="rules" label-position="right" label-width="60px" status-icon>
              <el-form-item prop="account" label="账户">
                <el-input v-model="form.account" />
              </el-form-item>
              <el-form-item prop="password" label="密码">
                <el-input v-model="form.password" />
              </el-form-item>
              <el-form-item prop="agree" label-width="22px">
                <el-checkbox size="large" v-model="form.agree">
                  我已同意隐私条款和服务条款
                </el-checkbox>
              </el-form-item>
              <el-button size="large" class="subBtn" @click="doLogin">点击登录</el-button>
            </el-form>
          </div>
          <!-- 短信登录 -->
          <div class="form" v-if="activeTab === 'sms'">
            <el-form label-position="right" label-width="60px" status-icon>
              <el-form-item label="手机号">
                <el-input v-model="mobile" placeholder="请输入手机号" />
              </el-form-item>
              <el-form-item label="验证码">
                <div class="sms-row">
                  <el-input v-model="code" placeholder="请输入验证码" />
                  <el-button
                    class="sms-btn"
                    :disabled="!canSendCode"
                    :loading="codeSending"
                    @click="sendCode"
                  >{{ countdown > 0 ? countdown + 's后重发' : '获取验证码' }}</el-button>
                </div>
              </el-form-item>
              <el-button size="large" class="subBtn" @click="doMobileLogin">点击登录</el-button>
            </el-form>
          </div>
        </div>
      </div>
    </section>

    <footer class="login-footer">
      <div class="container">
        <p>
          <a href="javascript:;">关于我们</a>
          <a href="javascript:;">帮助中心</a>
          <a href="javascript:;">售后服务</a>
          <a href="javascript:;">配送与验收</a>
          <a href="javascript:;">商务合作</a>
          <a href="javascript:;">搜索推荐</a>
          <a href="javascript:;">友情链接</a>
        </p>
        <p>CopyRight &copy; 小兔鲜儿</p>
      </div>
    </footer>
  </div>
</template>

<style scoped lang='scss'>
.login-header {
  background: #fff;
  border-bottom: 1px solid #e4e4e4;

  .container {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
  }

  .logo {
    width: 200px;

    a {
      display: block;
      height: 132px;
      width: 100%;
      text-indent: -9999px;
      background: url("@/assets/images/logo.png") no-repeat center 18px / contain;
    }
  }

  .sub {
    flex: 1;
    font-size: 24px;
    font-weight: normal;
    margin-bottom: 38px;
    margin-left: 20px;
    color: #666;
  }

  .entry {
    width: 120px;
    margin-bottom: 38px;
    font-size: 16px;

    i {
      font-size: 14px;
      color: $xtxColor;
      letter-spacing: -5px;
    }
  }
}

.login-section {
  height: 488px;
  position: relative;
  overflow: hidden;

  .login-bg {
    position: absolute;
    inset: 0;
    z-index: 0;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .wrapper {
    width: 380px;
    background: #fff;
    position: absolute;
    left: 50%;
    top: 54px;
    transform: translate3d(100px, 0, 0);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
    z-index: 1;

    nav {
      font-size: 14px;
      height: 55px;
      margin-bottom: 20px;
      border-bottom: 1px solid #f5f5f5;
      display: flex;
      padding: 0 40px;
      text-align: right;
      align-items: center;

      a {
        flex: 1;
        line-height: 1;
        display: inline-block;
        font-size: 18px;
        position: relative;
        text-align: center;
        &.active {
          color: $xtxColor;
          font-weight: bold;
        }
      }
    }
  }
}

.login-footer {
  padding: 30px 0 50px;
  background: #fff;

  p {
    text-align: center;
    color: #999;
    padding-top: 20px;

    a {
      line-height: 1;
      padding: 0 10px;
      color: #999;
      display: inline-block;

      ~a {
        border-left: 1px solid #ccc;
      }
    }
  }
}

.account-box {
  .toggle {
    padding: 15px 40px;
    text-align: right;

    a {
      color: $xtxColor;

      i {
        font-size: 14px;
      }
    }
  }

  .form {
    padding: 0 20px 20px 20px;

    &-item {
      margin-bottom: 28px;

      .input {
        position: relative;
        height: 36px;

        >i {
          width: 34px;
          height: 34px;
          background: #cfcdcd;
          color: #fff;
          position: absolute;
          left: 1px;
          top: 1px;
          text-align: center;
          line-height: 34px;
          font-size: 18px;
        }

        input {
          padding-left: 44px;
          border: 1px solid #cfcdcd;
          height: 36px;
          line-height: 36px;
          width: 100%;

          &.error {
            border-color: $priceColor;
          }

          &.active,
          &:focus {
            border-color: $xtxColor;
          }
        }

        .code {
          position: absolute;
          right: 1px;
          top: 1px;
          text-align: center;
          line-height: 34px;
          font-size: 14px;
          background: #f5f5f5;
          color: #666;
          width: 90px;
          height: 34px;
          cursor: pointer;
        }
      }

      >.error {
        position: absolute;
        font-size: 12px;
        line-height: 28px;
        color: $priceColor;

        i {
          font-size: 14px;
          margin-right: 2px;
        }
      }
    }

    .agree {
      a {
        color: #069;
      }
    }

    .btn {
      display: block;
      width: 100%;
      height: 40px;
      color: #fff;
      text-align: center;
      line-height: 40px;
      background: $xtxColor;

      &.disabled {
        background: #cfcdcd;
      }
    }
  }

  .action {
    padding: 20px 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .url {
      a {
        color: #999;
        margin-left: 10px;
      }
    }
  }
}

.subBtn {
  background: $xtxColor;
  width: 100%;
  color: #fff;
}
.sms-row {
  display: flex;
  gap: 8px;
  .sms-btn {
    flex-shrink: 0;
    width: 120px;
  }
}
</style>
