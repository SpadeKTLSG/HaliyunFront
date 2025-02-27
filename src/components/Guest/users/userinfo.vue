<template>
  <div class="userinfo">
    <!-- 上部区域-->
    <div class="userinfo_upper">
      <!--用户User表信息-->
      <el-col :span="8" class="userinfo-basic">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="账号">{{ userData.account }}</el-descriptions-item>
          <el-descriptions-item label="管理员">
            {{ userData.admin === 1 ? '是' : '否' }}
          </el-descriptions-item>
          <el-descriptions-item label="账号状态">{{ statusDescription }}</el-descriptions-item>
          <el-descriptions-item label="登陆类型">{{ userData.loginType === 3 ? '手机验证码' : '暂不支持请等待后续适配' }}</el-descriptions-item>
        </el-descriptions>
      </el-col>
      <el-col :span="8" class="">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="Gender">{{ userData.gender }}</el-descriptions-item>
          <el-descriptions-item label="Phone">{{ userData.phone }}</el-descriptions-item>
          <el-descriptions-item label="Email">{{ userData.email }}</el-descriptions-item>
          <el-descriptions-item label="Area">{{ userData.area }}</el-descriptions-item>
          <el-descriptions-item label="Nickname">{{ userData.nickname }}</el-descriptions-item>
          <el-descriptions-item label="Introduce">{{ userData.introduce }}</el-descriptions-item>
          <el-descriptions-item label="Level ID">{{ userData.levelId }}</el-descriptions-item>
          <el-descriptions-item label="VIP">{{ userData.vip }}</el-descriptions-item>
          <el-descriptions-item label="Create Group Count">{{ userData.createGroupCount }}</el-descriptions-item>
          <el-descriptions-item label="Create Group Max">{{ userData.createGroupMax }}</el-descriptions-item>
          <el-descriptions-item label="Join Group Count">{{ userData.joinGroupCount }}</el-descriptions-item>
          <el-descriptions-item label="Join Group Max">{{ userData.joinGroupMax }}</el-descriptions-item>
          <el-descriptions-item label="Coin">{{ userData.coin }}</el-descriptions-item>
          <el-descriptions-item label="Energy Coin">{{ userData.energyCoin }}</el-descriptions-item>
          <el-descriptions-item label="Register Code">{{ userData.registerCode }}</el-descriptions-item>
          <el-descriptions-item label="Level Floor">{{ userData.levelFloor }}</el-descriptions-item>
          <el-descriptions-item label="Level Name">{{ userData.levelName }}</el-descriptions-item>
        </el-descriptions>
      </el-col>

      <!--用户User表信息提取用户头像/账号-->
      <el-col :span="12" class="userinfo-profile">
        <el-card class="avatar-card" shadow="hover">
          <img :src="userData.avatar" alt="User Avatar" class="avatar-image"/>
          <div class="account-name">{{ userData.account }}</div>
        </el-card>
      </el-col>
    </div>

    <!--下部区域-->
    <div class="userinfo_lower">
      <!--用户UserDetail表信息-->
      <div class="userinfo-detail">
        <el-col :span="8" class="">
          <el-descriptions :column="1" border>
            <el-descriptions-item label="Gender">{{ userData.gender }}</el-descriptions-item>
            <el-descriptions-item label="Phone">{{ userData.phone }}</el-descriptions-item>
            <el-descriptions-item label="Email">{{ userData.email }}</el-descriptions-item>
            <el-descriptions-item label="Area">{{ userData.area }}</el-descriptions-item>
            <el-descriptions-item label="Nickname">{{ userData.nickname }}</el-descriptions-item>
            <el-descriptions-item label="Introduce">{{ userData.introduce }}</el-descriptions-item>
            <el-descriptions-item label="Level ID">{{ userData.levelId }}</el-descriptions-item>
            <el-descriptions-item label="VIP">{{ userData.vip }}</el-descriptions-item>
            <el-descriptions-item label="Create Group Count">{{ userData.createGroupCount }}</el-descriptions-item>
            <el-descriptions-item label="Create Group Max">{{ userData.createGroupMax }}</el-descriptions-item>
            <el-descriptions-item label="Join Group Count">{{ userData.joinGroupCount }}</el-descriptions-item>
            <el-descriptions-item label="Join Group Max">{{ userData.joinGroupMax }}</el-descriptions-item>
            <el-descriptions-item label="Coin">{{ userData.coin }}</el-descriptions-item>
            <el-descriptions-item label="Energy Coin">{{ userData.energyCoin }}</el-descriptions-item>
            <el-descriptions-item label="Register Code">{{ userData.registerCode }}</el-descriptions-item>
            <el-descriptions-item label="Level Floor">{{ userData.levelFloor }}</el-descriptions-item>
            <el-descriptions-item label="Level Name">{{ userData.levelName }}</el-descriptions-item>
          </el-descriptions>
        </el-col>

      </div>

    </div>

  </div>
</template>


<script setup>
import * as Maven from '@/components/common/maven.js'
import {inject} from "vue";

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

// !后端获取的数据
const userData = ref({
  account: 'Admin',
  admin: 1,
  status: 0,
  loginType: 3,
  // password is intentionally omitted
  gender: 1,
  phone: '15911451419',
  email: 'spadekxcwxtlsg@gmail.com',
  avatar: 'default', // URL or asset path for the avatar
  area: '地球',
  nickname: '管理员玄桃K',
  introduce: '这个人很懒，什么都没有留下',
  levelId: "1894671134331666432",
  vip: 1,
  createGroupCount: 0,
  createGroupMax: 114514,
  joinGroupCount: 0,
  joinGroupMax: 1145141919,
  coin: 1099,
  energyCoin: 1099,
  registerCode: '3662f948d2014bc08b892014b32c8fb0',
  levelFloor: 7,
  levelName: '以太'
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
      return '未知';
  }
});

function someMethod() {
}

</script>


<style lang="scss" scoped>

.userinfo {


  .userinfo_upper {
    display: flex;
    justify-content: space-between;
    margin-top: -100px;
    margin-bottom: 10px;

    .userinfo-basic {

      padding-top: -30px; //
      padding-right: 10px;
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
    .userdetail-card {
      width: 100%;
      min-height: 300px;
      padding: 20px;
    }
  }
}

</style>
