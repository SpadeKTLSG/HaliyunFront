<template>
  <div class="userinfo">
    <!-- 上部区域-->
    <div class="userinfo_upper">

      <!--用户User表信息-->
      <el-col :span="8" class="userinfo-basic">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="账号名">{{ userData.account }}</el-descriptions-item>
          <el-descriptions-item label="管理员权限"> {{ userData.admin === 1 ? '是' : '否' }}</el-descriptions-item>
          <el-descriptions-item label="账号状态">{{ statusDescription }}</el-descriptions-item>
          <el-descriptions-item label="登陆类型">{{ userData.loginType === 3 ? '手机验证码' : '暂不支持请等待后续适配' }}</el-descriptions-item>
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

        <!--注销账号-->
        <el-button @click="delAccount()" class="userinfo_op-buttons">删号</el-button>

        <!--登出 - 同之前的登出操作-->
        <el-button @click="logout()" class="userinfo_op-buttons">登出</el-button>

        <!--注销账号-->
        <el-button @click="delAccount()" class="userinfo_op-buttons">删号</el-button>

      </el-col>

    </div>


    <!--修改表单组件-->
    <el-dialog :visible.sync="formVisible" title="修改用户信息">

      <!--表单对象-->
      <el-form :model="userData4Update" label-width="120px">

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
      <div slot="footer" class="dialog-footer">
        <el-button @click="formVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">提交</el-button>
      </div>

    </el-dialog>
  </div>
</template>


<script setup>
import * as Maven from '@/components/common/maven.js'
import {inject} from "vue";
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


// DI 依赖注入
const currentPage = inject('currentPage');
const userStore = useUserStore()


//? 用户数据展示表单
const userData = ref({
  //User表
  admin: 1,
  status: 0,
  account: 'Admin',
  loginType: 3,

  //UserDetail表
  gender: 1,
  phone: '15911451419',
  email: 'spadekxcwxtlsg@gmail.com',
  avatar: 'default', // 这字段不展示暂未接入OSS, 如果是default就直接去拿本地即可
  area: '地球',
  nickname: '管理员玄桃K',
  introduce: '这个人很懒，什么都没有留下'
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
      return '停用';
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
      return '不明';
  }
});


//! 查
// 获取用户数据
const getData = () => {
  http({
    url: http.adornUrl('Guest/users/user_info'),
    method: 'get',
    params: http.adornParams({
      id: userStore.id
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
};

//? 用户数据修改表单 : 只有能修改的字段, 需要查询时候也填过来
// note: 未来方便管理, 于是拆分为了两个表单. 一个是展示表单, 一个是修改表单
const userData4Update = ref({
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
}

</style>
