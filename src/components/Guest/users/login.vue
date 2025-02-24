<template>
  <div class="login">
    <div class="login-box">


      <div class="mid">
        <!--登录表单-->
        <el-form
            ref="dataFormRef"
            :model="dataForm"
            :rules="dataRule"
            status-icon
        >
          <el-form-item prop="account">
            <el-input
                v-model="dataForm.account"
                class="info"
                placeholder="请输入帐号"
            />
          </el-form-item>

          <el-form-item prop="password">
            <el-input
                v-model="dataForm.password"
                class="info"
                placeholder="请输入密码"
                type="password"
            />
          </el-form-item>

          <el-form-item prop="phone">

            <el-input
                v-model="dataForm.phone"
                class="info"
                placeholder="请输入手机号"

            />


          </el-form-item>

          <el-form-item prop="code">
            <el-input
                v-model="dataForm.code"
                class="code"
                placeholder="请输入验证码"
            />
            <el-button
                class="get_code"
                type="primary"
                @click="getCode"
            >
              获取验证码
            </el-button>
          </el-form-item>

          <el-form-item class="login_launch">
            <el-button
                class="login-btn1"
                type="primary"
                @click="login2User"
            >
              用户登录
            </el-button>
            <el-button
                class="login-btn2"
                type="primary"
                @click="login2Admin"
            >
              管理登录
            </el-button>
          </el-form-item>

          <el-text class="login-tip" @click="regi(0)">
            没有账号? 点我立即注册
          </el-text>

        </el-form>
        <el-text class="login-tip-admin" @click="regi(1)">
          管理员内部注册入口
        </el-text>
      </div>


      <div class="bottom-sign">
        Copyright © 2025 睡眠促进委员会 Sleep Promotion Committee
      </div>
    </div>
  </div>
</template>

<script setup>
import * as Maven from '@/components/common/maven.js'
import {inject} from 'vue'
import {useUserStore} from "@/components/common/user.js";
import DOMPurify from 'dompurify';

let ElButton, ElCard, ElCascader, ElCol, ElConfigProvider, ElDialog, ElDropdown, ElDropdownItem, ElDropdownMenu, ElForm, ElFormItem, ElInput, ElInputNumber, ElMenu, ElMenuItem,
    ElMenuItemGroup, ElPopover, ElRadio, ElRadioGroup, ElRow, ElScrollbar, ElSubMenu, ElTable, ElTableColumn, ElTag, ElText, ElTooltip, ElMessage, ref, watch, reactive, onMounted,
    onBeforeMount, nextTick, computed, cookie, http, Debounce, encrypt;
({
  ElButton, ElCard, ElCascader, ElCol, ElConfigProvider, ElDialog, ElDropdown,
  ElDropdownItem, ElDropdownMenu, ElForm, ElFormItem, ElInput, ElInputNumber,
  ElMenu, ElMenuItem, ElMenuItemGroup, ElPopover, ElRadio, ElRadioGroup, ElRow,
  ElScrollbar, ElSubMenu, ElTable, ElTableColumn, ElTag, ElText, ElTooltip,
  ElMessage, ref, watch, reactive, onMounted, onBeforeMount, nextTick, computed,
  cookie, http, Debounce, ezEncrypt: encrypt
} = Maven);

/**
 * 表单引用
 */
const dataFormRef = ref(null)

/**
 * 表单数据
 */
const dataForm = ref({
  account: '',
  //主要账号:
  // Admin, 15911451419
  // Guest, 15911451420
  password: 2333, //调试使用
  phone: '15911451419',
  code: ''
})


/**
 * 计算属性, 用于转义用户输入
 */
const sanitizedDataForm = computed(() => ({
  account: DOMPurify.sanitize(dataForm.value.account),
  password: DOMPurify.sanitize(dataForm.value.password),
  phone: DOMPurify.sanitize(dataForm.value.phone),
  code: DOMPurify.sanitize(dataForm.value.code)
}));

/**
 * 表单验证规则
 */
const dataRule = {
  account: [
    {
      required: true,
      message: '帐号不能为空',
      trigger: 'blur'
    }
  ],
  password: [
    {
      required: true,
      message: '密码不能为空',
      trigger: 'blur'
    }
  ],
  phone: [
    {
      required: true,
      message: '手机号不能为空',
      trigger: 'blur'
    }
  ]
}


// DI 依赖注入
const currentPage = inject('currentPage');


//! 验证码获取
const getCode = () => {

  http({
    url: http.adornUrl('Guest/users/code'),
    method: 'get',
    params: http.adornParams({
      phone: sanitizedDataForm.value.phone
    })
  }).then(({data}) => {
    console.log(data + '验证码信息')
    ElMessage({
      message: '验证码已发送:===> ' + data,
      type: 'success',
      duration: 10000
    });
  })
      .catch(() => {
        ElMessage({
          message: '验证码发送失败',
          type: 'error',
          duration: 1000
        });
      })
}


//! 登陆
let userType = 0;
const userStore = useUserStore()

const login2User = () => {
  userType = 0;
  login()
}

const login2Admin = () => {
  userType = 1;
  login()
}

const login = () => {

  http({
    url: http.adornUrl('Guest/users/login'),
    method: 'post',
    data: http.adornData({
      account: dataForm.value.account,
      passWord: encrypt(dataForm.value.password),
      phone: dataForm.value.phone, //管理员手机号: 15911451419
      code: dataForm.value.code,
      admin: userType,
      loginType: 3, //暂时只支持手机 + 账密登录
    })
  }).then(({data}) => {
    ElMessage({
      message: "登录成功",
      type: 'success',
      duration: 1000
    });
    cookie.set('authorization', data, '7d')
    cookie.set('account', dataForm.value.account, '7d')
    console.log('登录成功, cookie: ' + cookie.get('authorization') + "  |  " + cookie.get('account'))

    // 获取用户信息
    http({
      url: http.adornUrl('Guest/users/user_tl'),
      method: 'post'
    }).then(({data}) => {
      console.log(data)
      // 保存用户信息到userStore
      userStore.updateId(data.id)
      userStore.updateAccount(data.account)
      userStore.updatePhone(data.phone)
      userStore.updateLoginType(data.loginType)
      userStore.updateAdmin(data.admin)
      userStore.updateToken(cookie.get('authorization'))
      console.log('用户 userStore 已经保存')

      // 保存用户信息到localStorage
      const userWithExpiry = {
        ...data,
        token: cookie.get('authorization'),
        expiry: new Date().getTime() + 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
      };
      localStorage.setItem('user', JSON.stringify(userWithExpiry));
      console.log('用户信息已经保存到localStorage, 过期时间为: ' + userWithExpiry.expiry)

      ElMessage({
        message: '用户id: ' + userStore.id + '   |用户账号: ' + userStore.account + '   |用户手机号: ' + userStore.phone + '   |登录类型Type: ' + userStore.loginType + '   |管理员类型: ' + (userStore.loginType === 1 ? '管理员' : '用户'),
        type: 'success',
        duration: 7000
      });
    })
    // 跳转到介绍页
    nextTick(() => {
      currentPage.value = 'home';
    })
  }).catch((response) => {
    ElMessage({
      message: response.message,
      type: 'error',
      duration: 1000
    });
  })
}

//! 注册


const regi = (userType) => {
  http({
    url: http.adornUrl('Guest/users/register'),
    method: 'post',
    data: http.adornData({
      account: sanitizedDataForm.value.account,
      password: encrypt(dataForm.value.password),
      phone: sanitizedDataForm.value.phone,
      code: sanitizedDataForm.value.code,
      admin: userType
    })
  }).then(({data}) => {
    ElMessage({
      message: "注册成功",
      type: 'success',
      duration: 1000
    });
  }).catch((e) => {
    ElMessage({
      message: e.message,
      type: 'error',
      duration: 1000
    });
  })
}

</script>

<style lang="scss" scoped>


.login {
  width: 1650px;
  height: 810px;
  border-radius: 10px;
  background: url("@/../static/bg/login-bg.jpg") no-repeat;
  background-size: cover;
  justify-content: center;


  .login-box {
    padding-left: 25px;
    padding-top: 130px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .mid {
      font-size: 14px;

      .info {
        width: 410px;
      }

      .code {
        width: 300px;
        padding-right: 20px;

        .get_code {
          margin-left: 10px;
        }
      }


      .login_launch {
        .login-btn1 {
          width: 200px;
        }

        .login-btn2 {
          width: 200px;
        }
      }

      .login-tip {
        color: #999;
        font-size: 12px;
        margin-top: 10px;
        cursor: pointer;
      }

      .login-tip-admin {
        color: #999;
        font-size: 12px;
        margin-left: 250px;
        cursor: pointer;
      }

    }


    .bottom-sign {
      color: #999;
      font-size: 12px;
      text-align: center;
      margin-top: auto; /* Push to the bottom */
      padding-top: 27%;
      padding-bottom: 5%; /* Add padding at the bottom */

    }

  }
}

</style>
