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
          <el-text class="login-tip-admin" @click="regi(1)">
            管理员内部注册入口
          </el-text>
        </el-form>

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

import DOMPurify from 'dompurify';
import {UserContext, UserTL} from "@/components/common/user.js";

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


const login2User = () => {
  userType = 0;
  login()
}

const login2Admin = () => {
  userType = 1;
  login()
}

const login = () => {

  //? note: 登陆的流程: (异步可能会出问题, 因此全部使用同步)
  // 1. 基础表单来发起登陆请求
  // 2. 获得的返回data是令牌, 需要先保存到cookie, 并加上accout
  // 3. 有了cookie才能作为继续访问鉴权接口的凭证, 之后再获得用户完整信息
  // 4. 获取了用户完整信息之后存入到localStorage, 之后就可以在任何地方使用了

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

    cookie.set('authorization', data, '7d')
    cookie.set('account', dataForm.value.account, '7d')

    ElMessage({
      message: "登录成功",
      type: 'success',
      duration: 1000
    });

    // console.log('登录成功, cookie: ' + cookie.get('authorization') + "  |  " + cookie.get('account'))

    // 获取用户标志信息
    http({
      url: http.adornUrl('Guest/users/user_mark'),
      method: 'get',
      params: http.adornParams({
        account: dataForm.value.account
      })
    }).then(({data}) => {

      // 保存用户信息到localStorage: 显式UserTL对象
      UserContext.setUser(new UserTL(
          data.id,
          data.account,
          data.phone,
          data.loginType,
          data.admin,
          cookie.get('authorization'),
          new Date().getTime() + 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
      ));

      // 提示用户信息 (测试使用)
      const storedUser = UserContext.getUser()
      ElMessage({
        message: '用户id: ' + storedUser.id + '   |   用户账号: ' + storedUser.account + '   |   用户手机号: ' + storedUser.phone + '   |   用户登录类型: ' + storedUser.loginType + '   |   用户权限: ' + storedUser.admin + '   |   用户token: ' + storedUser.token,
        type:
            'success',
        duration:
            5000
      })
      ;
    })
    // 跳转到介绍页
    nextTick(() => {
      currentPage.value = 'home';
    })
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
      message: "注册成功, 请登录",
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
        margin-left: 10px;
        cursor: pointer; //鼠标变成小手
        text-decoration: underline; //下划线
      }

      .login-tip-admin {
        color: #999;
        font-size: 12px;
        margin-left: 150px;
        cursor: pointer; //鼠标变成小手
        text-decoration: underline; //下划线
      }

    }


    .bottom-sign {
      color: #999;
      font-size: 12px;
      text-align: center;
      margin-top: auto; /* Push to the bottom */
      padding-top: 20%;


    }

  }
}

</style>
