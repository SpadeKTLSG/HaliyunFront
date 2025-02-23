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
import './login.scss'
import * as Maven from '@/components/common/maven.js'
import {inject} from 'vue'
import {useUserStore} from "@/components/common/user.js";

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
      phone: dataForm.value.phone
    })
  }).then(({data}) => {
    console.log(data + '验证码信息')
    ElMessage({
      message: '验证码已发送:===> ' + data,
      type: 'success',
      duration: 1000
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
let userType = 0; // 0 = user, 1 = admin
const userStore = useUserStore()

const login2User = () => {
  userType = 0;
  login()
}

const login2Admin = () => {
  userType = 1;
  login()
}

const login = async () => {
  try {
    const {data} = await http({
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
    });

    ElMessage({
      message: "登录成功",
      type: 'success',
      duration: 1000
    });
    cookie.set('Authorization', data);
    cookie.set('account', dataForm.value.account);

    // 获取用户信息
    const userInfo = await http({
      url: http.adornUrl('Guest/users/user_tl'),
      method: 'post'
    });

    console.log(userInfo.data);
    // 保存用户信息到userStore
    userStore.updateId(userInfo.data.id);
    userStore.updateAccount(userInfo.data.account);
    userStore.updatePhone(userInfo.data.phone);
    userStore.updateLoginType(userInfo.data.loginType);
    userStore.updateAdmin(userInfo.data.admin);
    console.log(userStore + ': 用户信息已经保存');

    ElMessage({
      message: '用户id: ' + userStore.id + '   |用户账号: ' + userStore.account + '   |用户手机号: ' + userStore.phone + '   |登录类型Type: ' + userStore.loginType + '   |管理员类型: ' + (userStore.loginType === 1 ? '管理员' : '用户'),
      type: 'success',
      duration: 7000
    });

    // 跳转到介绍页
    nextTick(() => {
      currentPage.value = 'home';
    });
  } catch (response) {
    ElMessage({
      message: response.message,
      type: 'error',
      duration: 1000
    });
  }
};

//! 注册


const regi = (userType) => {
  http({
    url: http.adornUrl('Guest/users/register'),
    method: 'post',
    data: http.adornData({
      account: dataForm.value.account,
      password: encrypt(dataForm.value.password),
      phone: dataForm.value.phone,
      code: dataForm.value.code,
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

