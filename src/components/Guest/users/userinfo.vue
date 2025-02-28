<template>
  <!--主体-->

  <div class="userinfo">
    <!-- 上部区域-->
    <div class="userinfo_upper">

      <!--用户User表信息-->
      <el-col :span="8" class="userinfo-basic">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="账号名">{{ userData.account }}</el-descriptions-item>
          <el-descriptions-item label="管理员权限"> {{ userData.admin === 1 ? '是' : '否' }}</el-descriptions-item>
          <el-descriptions-item label="账号状态">{{ statusDescription }}</el-descriptions-item>
          <el-descriptions-item label="登陆类型">{{ userData.loginType === 3 ? '手机验证码' : '非法!' }}</el-descriptions-item>
          <el-descriptions-item label="昵称">{{ userData.nickname }}</el-descriptions-item>
        </el-descriptions>
      </el-col>

      <!--垂直分割线-->
      <el-divider :direction="'vertical'"
                  :content-position="'center'"
                  class="full-height-divider">
      </el-divider>

      <!--用户User表信息提取用户头像/账号-->
      <el-col :span="6" class="userinfo-profile">
        <el-card class="avatar-card" shadow="hover">
          <img :src="userData.avatar === 'default' ? '@/../static/img/首页轮播图集合 (2).png' : '' " alt="User Avatar" class="avatar-image"/>
          <div class="account-name">{{ userData.account }}</div>
        </el-card>
      </el-col>

    </div>

    <el-divider></el-divider>

    <!--下部区域-->
    <div class="userinfo_lower">

      <!--用户UserDetail表信息-->
      <div class="userinfo-detail">
        <el-col :span="8">
          <el-descriptions :column="1" border>
            <el-descriptions-item label="性别">{{ genderDescription }}</el-descriptions-item>
            <el-descriptions-item label="手机号">{{ userData.phone }}</el-descriptions-item>
            <el-descriptions-item label="邮箱">{{ userData.email }}</el-descriptions-item>
            <el-descriptions-item label="地区">{{ userData.area }}</el-descriptions-item>
            <el-descriptions-item label="介绍">{{ userData.introduce }}</el-descriptions-item>
          </el-descriptions>
        </el-col>
      </div>

      <el-divider></el-divider>

      <!--操作按钮-->

      <el-col :span="10">

        <!--刷新-获取数据-->
        <el-button @click="getData()" class="userinfo_op-buttons">刷新</el-button>

        <!--修改-弹出修改表单 + 修改密码需求-->
        <el-button @click="showForm()" class="userinfo_op-buttons">修改</el-button>

        <!--登出 - 同之前的登出操作-->
        <el-button @click="logout()" class="userinfo_op-buttons">登出</el-button>

        <!--逻辑删除账号-->
        <el-button @click="delAccount()" class="userinfo_op-buttons">删号</el-button>

        <!--关闭界面-->
        <el-button @click="()=>{currentPage=''}" class="userinfo_op-buttons">已阅</el-button>

      </el-col>

    </div>


    <!--修改表单组件-->
    <el-dialog
        v-model="formVisible"
        class="userinfo-dialog"
        title="修改用户信息">

      <!--表单对象-->
      <el-form :model="userData4Update" class="userinfo-dialog-main">

        <!--密码确认修改组合对象-->


        <!--基础修改对象-->
        <el-form-item label="昵称">
          <el-input v-model="userData4Update.nickname"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="userData4Update.gender">
            <el-option label="男" :value="1"></el-option>
            <el-option label="女" :value="0"></el-option>
            <el-option label="不明" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="userData4Update.email"></el-input>
        </el-form-item>
        <el-form-item label="地区">
          <el-input v-model="userData4Update.area"></el-input>
        </el-form-item>
        <el-form-item label="介绍">
          <el-input v-model="userData4Update.introduce"></el-input>
        </el-form-item>

      </el-form>

      <!--表单操作-->
      <div slot="footer" class="userinfo-dialog-footer">
        <el-button @click="formVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">提交</el-button>
      </div>

    </el-dialog>

  </div>


</template>


<script setup>
import * as Maven from '@/components/common/maven.js'
import {inject} from "vue";
import {UserContext} from "@/components/common/user.js";

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


// DI 依赖注入
const props = defineProps({
  class: String,
});
const emit = defineEmits(['close']);
const currentPage = inject('currentPage');


//? 用户数据展示表单
const userData = ref({
  //User表
  admin: '-/-',
  status: '-/-',
  account: '-/-',
  loginType: '-/-',

  //UserDetail表
  gender: '-/-',
  phone: '-/-',
  email: '-/-',
  avatar: '-/-', // 这字段不展示暂未接入OSS, 如果是default就直接去拿本地即可
  area: '-/-',
  nickname: '-/-',
  introduce: '-/-'
});

//? 数据转义显示
// 用户账号状态展示
const statusDescription = computed(() => {
  switch (userData.value.status) {
    case 0:
      return '正常';
    case 1:
      return '停用';
    case 2:
      return '封禁';
    default:
      return '-/-';
  }
});


// 用户性别展示
const genderDescription = computed(() => {
  switch (userData.value.gender) {
    case 0:
      return '女';
    case 1:
      return '男';
    case 2:
      return '不明';
    default:
      return '-/-';
  }
});


//! 查

// 使用 onMounted 钩子在组件加载时获取数据
onMounted(() => {
  getData();
});

// 获取用户数据
const getData = () => {
  http({
    url: http.adornUrl('Guest/users/user_info'),
    method: 'get',
    params: http.adornParams({
      id: UserContext.getUserId(),
    })
  }).then(({data}) => {
    userData.value = data;
    formData.value = {...userData.value};
  }).catch((error) => {
    ElMessage({
      message: '获取用户数据失败: ' + error.message,
      type: 'error',
      duration: 1000
    });
  });
};


//! 改
const formData = ref({...userData.value});
const formVisible = ref(false);
// 显示修改表单
const showForm = () => {
  formVisible.value = true;

  //把展示表单的数据复制到修改表单(userData4Update), 但是只能给他本身有的字段
  for (const key in userData4Update.value) {
    if (formData.value.hasOwnProperty(key)) {
      userData4Update.value[key] = formData.value[key];
    }
  }
};

//? 用户数据修改表单 : 只有能修改的字段, 需要查询时候也填过来
// note: 未来方便管理, 于是拆分为了两个表单. 一个是展示表单, 一个是修改表单
const userData4Update = ref({
  id: UserContext.getUserId(),
  password: '',
  gender: 2,
  email: '',
  avatar: 'default',
  area: '地球',
  nickname: '',
  introduce: ''
});

// 提交修改表单
const submitForm = () => {
  console.log(userData4Update.value)
  http({
    url: http.adornUrl('Guest/users/user_info'),
    method: 'put',
    data: http.adornData(userData4Update.value)
  }).then(() => {
    ElMessage({
      message: '用户信息更新成功',
      type: 'success',
      duration: 1000
    });
    formVisible.value = false;
    getData();
  }).catch((error) => {
    ElMessage({
      message: '更新用户信息失败: ' + error.message,
      type: 'error',
      duration: 1000
    });
  });
};


//! 登出


const logout = () => {

  // 后端登出
  http({
    url: http.adornUrl('Guest/users/logout'),
    method: 'delete'
  }).then(() => {
    // 前端登出
    UserContext.clearUser()

    nextTick(() => {
      window.location.replace('http://localhost:9876/');
    })

  }).catch(() => {
    ElMessage.error('登出失败');
  });
};


//! 注销

const delAccount = () => {
  http({
    url: http.adornUrl('Guest/users/killme'),
    method: 'delete',
    params: http.adornParams({
      id: UserContext.getUserId()
    })
  }).then(() => {
    ElMessage({
      message: '账号已注销',
      type: 'success',
      duration: 1000
    });
    logout();
  }).catch((error) => {
    ElMessage({
      message: '注销账号失败: ' + error.message,
      type: 'error',
      duration: 1000
    });
  });
};


</script>


<style lang="scss" scoped>

.userinfo {


  .userinfo_upper {
    display: flex;
    justify-content: space-between;
    margin-top: -100px;
    margin-bottom: 20px;

    .userinfo-basic {

      padding-top: -30px; //
      padding-right: 10px;
    }

    .full-height-divider {
      height: 120px;
    }

    .userinfo-profile {
      display: flex;
      justify-content: center;
      align-items: center;

      .avatar-card {
        width: 100%;
        text-align: center;

        .avatar-image {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          margin-bottom: 10px;
        }

        .account-name {
          font-size: 18px;
          font-weight: bold;
        }
      }
    }
  }

  .userinfo_lower {
    margin-top: 10px;
    margin-bottom: 20px;

    .userdetail-card {
      width: 100%;
      min-height: 300px;
      padding: 20px;
    }
  }


  .userinfo-dialog {


    .userinfo-dialog-main {
      padding: 20px;
    }

    .userinfo-dialog-footer {
      text-align: center;
    }

  }
}

</style>
