<template>
  <div class="app-container">
    <!-- 0 主页本身 - 背景 -->
    <div class="background">
      <el-container class="home-container">
        <!-- 1 头部区域 (持久化) -->
        <el-header class="header">
          <!-- 1.1 头部左侧 通知 -->
          <div class="header-left">

            <el-icon class="notification-icon">
              <ChatDotRound/>
            </el-icon>

            <el-icon class="app-icon">
              <Suitcase/>
            </el-icon>

            <span class="notification-count">{{ mesCount }}</span>
          </div>

          <!-- 1.2 头部中间 标题 -->
          <div class="header-center">

            <div class="title">欢迎来到Haliyun网盘</div>

          </div>

          <!-- 1.3 头部右侧 容量, 时间等组件 -->
          <div class="header-right">
            <div class="time">{{ currentTime }}</div>
          </div>
        </el-header>

        <!-- 2 ///// 主体区域 (切换区域) /////-->
        <el-main class="main-content">

          <div v-if="currentApp === 'App'" class="only-app-content">

            <!-- 2.0 应用名称 + LOGO-->
            <div class="app-name">
              Haliyun网盘
              <el-icon>
                <Cloudy/>
              </el-icon>
            </div>


            <!-- 2.1 搜索框 -->
            <el-input
                v-model="searchQuery"
                :suffix-icon="Search"
                class="search-box"
                placeholder="随处搜索"
                @keyup.enter="search"
            >
              <el-icon slot="suffix" class="search-icon"></el-icon>
            </el-input>

            <!-- 2.2 App列表区域 页面宽度动态排列, 超过了滚动 -->
            <div class="app-list">
              <div v-for="app in apps"
                   class="app-target">

                <el-button
                    :key="app.name"
                    class="square-button"
                    @click="openApp(app.name)"
                >
                  <el-image
                      class="full-size-image"
                      fit="contain"
                      src="../static/svg/LOGOWeb.svg">
                  </el-image>
                </el-button>

                <el-text class="app-show-text">
                  {{ app.show }}
                </el-text>

              </div>


            </div>

            <!-- 2.3 填充应用区域到下方的空白 -->
            <div class="spacer"></div>

            <!-- 2.4 右下角设置按钮 -->
            <el-button class="settings-button" @click="openApp('SettingApp')">
              <el-icon>
                <Setting/>
              </el-icon>
            </el-button>

            <!-- 2.5 右下角用户信息按钮 -->
            <el-button class="user_info-button" @click="openApp('PersonApp')">
              <el-icon>
                <Avatar/>
              </el-icon>
            </el-button>

          </div>

          <!-- B 对应应用组件页面 :  -->
          <div v-if="currentComponent" class="app-content">
            <component :is="currentComponent" @close="closeApp"/>
          </div>


        </el-main>

        <!-- 3 底部操作栏 (持久化 | 动态设置操作按钮) -->

        <el-col class="myfooter">
          <el-col class="footer-buttons">

            <!-- 3.1 应用功能列表按钮-->
            <el-button class="footer-button" @click="showAllApps">
              <el-icon>
                <Expand/>
              </el-icon>
            </el-button>

            <!-- 3.2 回退到这个App.vue主页(清空栈)按钮-->
            <el-button class="footer-button" @click="backAppHome">
              <el-icon>
                <HelpFilled/>
              </el-icon>
            </el-button>

            <!-- 3.3 回退App按钮(出栈)-->
            <el-button class="footer-button" @click="goBack">
              <el-icon>
                <ArrowLeft/>
              </el-icon>
            </el-button>

          </el-col>
        </el-col>


      </el-container>

    </div>

    <!-- A 宣传主页 - 背景 -->
    <div v-if="!enterWorld" class="welcome-screen">
      <!--  A1 滚动图片框 (2s滚动一次)-->

      <div class="scrolling-images">
        <el-image
            class="scrolling-image"
            fit="contain"
            src="../static/img/首页轮播图集合 (2).png">
        </el-image>
      </div>

      <span class="enter-tip">点击进入</span>

      <!--  A2 进入按钮 (倒计时10s自动进入) -->

      <el-button class="enter-button"
                 @click="enterApp">
        Hello World
      </el-button>

    </div>
  </div>
</template>

<script setup>
import './App.scss'
import * as Maven from '@/components/common/maven.js'

import {ArrowLeft, Avatar, ChatDotRound, Cloudy, Expand, HelpFilled, Search, Setting, Suitcase} from "@element-plus/icons-vue";
import {UserContext} from "@/components/common/user.js";

//对应应用组件
import LoginApp from "@/apps/login-app/login_app.vue";
import PersonApp from "@/apps/person-app/person_app.vue";
import LevelApp from "@/apps/level-app/level_app.vue";
import UserDataApp from "@/apps/user-data-app/user_data_app.vue";
import UserMesApp from "@/apps/user-mes-app/user_mes_app.vue";
import UserRecordApp from "@/apps/user-record-app/user_record_app.vue";
import ClusterManageApp from "@/apps/cluster-manage-app/cluster_manage_app.vue";
import ClusterInfoApp from "@/apps/cluster-info-app/cluster_info_app.vue";
import ClusterPostApp from "@/apps/cluster-post-app/cluster_post_app.vue";
import ShareApp from "@/apps/share-app/share_app.vue";
import ClusterFileApp from "@/apps/cluster-file-app/cluster_file_app.vue";
import AuthLockApp from "@/apps/auth-lock-app/auth_lock_app.vue";
import ClusterNoticeApp from "@/apps/cluster-notice-app/cluster_notice_app.vue";
import ClusterLevelApp from "@/apps/cluster-level-app/cluster_level_app.vue";
import BatchOpApp from "@/apps/batch-op-app/batch_op_app.vue";

let ElButton, ElCard, ElCascader, ElCol, ElConfigProvider, ElDialog, ElDropdown, ElDropdownItem, ElDropdownMenu, ElForm, ElFormItem, ElInput, ElInputNumber, ElMenu, ElMenuItem,
    ElMenuItemGroup, ElPopover, ElRadio, ElRadioGroup, ElRow, ElScrollbar, ElSubMenu, ElTable, ElTableColumn, ElTag, ElText, ElTooltip, ElMessage, ref, watch, reactive, onMounted,
    onBeforeMount, nextTick, computed, cookie, http, Debounce, encrypt;
({
  ElButton, ElCard, ElCascader, ElCol, ElConfigProvider, ElDialog, ElDropdown,
  ElDropdownItem, ElDropdownMenu, ElForm, ElFormItem, ElInput, ElInputNumber,
  ElMenu, ElMenuItem, ElMenuItemGroup, ElPopover, ElRadio, ElRadioGroup, ElRow,
  ElScrollbar, ElSubMenu, ElTable, ElTableColumn, ElTag, ElText, ElTooltip,
  ElMessage, ref, watch, reactive, onMounted, onBeforeMount, nextTick, computed,
  cookie, http, Debounce, encrypt
} = Maven);


// ! 应用/组件编排逻辑
// 当前页面App标识字段
const currentApp = ref('App');

// 应用集
const apps = [
  {name: 'LoginApp', show: '用户登陆'},
  {name: 'PersonApp', show: '用户信息'},
  {name: 'LevelApp', show: '用户等级'},
  {name: 'UserDataApp', show: '用户数据'},
  {name: 'UserMesApp', show: '用户消息'},
  {name: 'UserRecordApp', show: '用户记录'},
  {name: 'ClusterManageApp', show: '群组管理'},
  {name: 'ClusterInfoApp', show: '群组信息'},
  // {name: 'ClusterPostApp', show: '群组动态'},
  // {name: 'AuthLockApp', show: '权限与锁'},
  // {name: 'ClusterLevelApp', show: '群组等级'},
  {name: 'ClusterFileApp', show: '群组文件'},
  // {name: 'ShareApp', show: '分享管理'},
  {name: 'ClusterNoticeApp', show: '群组公告'},
  {name: 'BatchOpApp', show: '批量操作'},
  {name: 'XXXApp', show: '敬请期待'},
  // {name: 'XXXApp', show: '-'},
  // {name: 'XXXApp', show: '-'},
  // {name: 'XXXApp', show: '-'},
  // {name: 'XXXApp', show: '-'},
  // {name: 'XXXApp', show: '-'},
  // {name: 'XXXApp', show: '-'},
  // {name: 'XXXApp', show: '界面设置'},
  // {name: 'XXXApp', show: '推广捐赠'},
  // {name: 'XXXApp', show: '系统日志'}
];

// 计算属性来获取当前显示的组件
const currentComponent = computed(() => {
  switch (currentApp.value) {
    case 'LoginApp':
      return LoginApp;
    case 'PersonApp':
      return PersonApp;
    case 'LevelApp':
      return LevelApp;
    case 'UserDataApp':
      return UserDataApp;
    case 'UserMesApp':
      return UserMesApp;
    case 'UserRecordApp':
      return UserRecordApp;
    case 'ClusterManageApp':
      return ClusterManageApp;
    case 'ClusterInfoApp':
      return ClusterInfoApp;
    case 'ClusterPostApp':
      return ClusterPostApp;
    case 'ShareApp':
      return ShareApp;
    case 'ClusterFileApp':
      return ClusterFileApp;
    case 'AuthLockApp':
      return AuthLockApp;
    case 'ClusterNoticeApp':
      return ClusterNoticeApp;
    case 'ClusterLevelApp':
      return ClusterLevelApp;
    case 'BatchOpApp':
      return BatchOpApp;
    default:
      return null;
  }
});

/**
 * 显示页面
 */
const openApp = (appName) => {
  currentApp.value = appName;
}

/**
 * 关闭页面
 */
const closeApp = () => {
  currentApp.value = 'App';
};


// ?初始化逻辑


// 页面初始化
onMounted(() => {
  // 恢复用户
  loadUserFromLocalStorage();
  setInterval(() => {
    currentTime.value = new Date().toLocaleString();
  }, 1000);

  checkMes();

});

// ! 页面应用逻辑


// ! 页面展示组件


//? 首页支撑逻辑
// 时间
const currentTime = ref(new Date().toLocaleString());

// 搜索
const searchQuery = ref('');

/**
 * 搜索业务: 直接跳转到对应的应用, 调用对应
 */
const search = () => {

  // 用户输入 apps 里面的应用名称, 请对应到对应的应用name 实现跳转
  const app = apps.find(app => app.show === searchQuery.value);
  if (app) {
    openApp(app.name);
  } else {
    ElMessage({
      message: '没有找到对应的应用',
      type: 'warning',
      duration: 5000
    });
  }
};

// 进入App

// 控制开屏广告
const enterWorld = ref(false); //小熊二出来吧

const enterApp = () => {
  enterWorld.value = true;
};


// 未读消息
const mesCount = ref(0);
const checkMes = async () => {
  // 立刻获得一次消息情况
  await getUnreadMes();

  // 每10秒拉取一次
  setInterval(() => {
    if (mesCount.value > 0) {
      ElMessage({
        message: '你有新的消息, 请查看',
        type: 'success',
        duration: 5000,
        size: 'large',
      });
    }

    getUnreadMes();
  }, 10000 * 60);
};


// 拉取用户消息
const getUnreadMes = async () => {
  await http({
    url: http.adornUrl('Guest/messages/unread/count'),
    method: 'get'
  }).then(({data}) => {
    mesCount.value = data;
  }).catch((error) => {
    ElMessage({
      message: '获取用户未读消息数量失败: ' + error.message,
      type: 'error',
      duration: 1000
    });
  });
};


//? 操作栏功能
const showAllApps = () => {
  ElMessage({
    message: '系统应用列表: ' + apps.map(app => app.show).join('\n'),
    type: 'success'
  });
};

const backAppHome = () => {
  closeApp();
  ElMessage({
    message: '你已经回到首页',
    type: 'success'
  });
};

const goBack = () => {
  closeApp();
};

//! 用户登录相关
let hasLogin = false;


// 恢复用户登录状态
const loadUserFromLocalStorage = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user) {
    const now = new Date().getTime();
    if (now < user.expiry) {
      // 恢复 cookie
      cookie.set('authorization', user.token, '7d')
      cookie.set('account', user.account, '7d')
      console.log('登录成功, cookie: ' + cookie.get('authorization') + "  |  " + cookie.get('account'))

    } else { // 过期
      UserContext.clearUser()
    }
  }
};


//不能使用常规方法, 因为页面加载逻辑不同. 需要每次都计算这个, 当用户回到首页时候, 会重新计算
const notifyLogin = async () => {
  if (UserContext.hasUser()) {
    ElMessage({
      message: '欢迎回来, ' + UserContext.getUserAccount(),
      type: 'success'
    });
    hasLogin = true;
  } else {
    ElMessage({
      message: '您还未登录, 请先点击下方登录器进行登录',
      type: 'warning'
    });
  }
};

// 每次进入首页时候, 都会重新计算
watch(currentApp, (newVal) => {
  if (newVal === 'App') {
    notifyLogin();
  }
});
</script>

