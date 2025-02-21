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

            <span class="notification-count">99+</span>
          </div>

          <!-- 1.2 头部中间 标题 -->
          <div class="header-center">

            <div class="title">欢迎来到Haliyun网盘</div>

          </div>

          <!-- 1.3 头部右侧 容量, 时间等组件 -->
          <div class="header-right">
            <div class="capacity">80%</div>
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
import LoginApp from "@/apps/login-app/login_app.vue";
import {ArrowLeft, ChatDotRound, Cloudy, Expand, HelpFilled, Search, Setting, Suitcase} from "@element-plus/icons-vue";

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
  {name: 'LoginApp', show: '登陆器'},
  {name: 'SettingApp', show: '设置器'},
  {name: 'SettingApp', show: '设置器'},
  {name: 'SettingApp', show: '设置器'},
  {name: 'SettingApp', show: '设置器'},
  {name: 'SettingApp', show: '设置器'},
  {name: 'SettingApp', show: '设置器'},
  {name: 'SettingApp', show: '设置器'},
  {name: 'SettingApp', show: '设置器'},
  {name: 'SettingApp', show: '设置器'},
  {name: 'SettingApp', show: '设置器'},
  {name: 'SettingApp', show: '设置器'},
  {name: 'SettingApp', show: '设置器'},
  {name: 'SettingApp', show: '设置器'},
  {name: 'SettingApp', show: '设置器'},
  {name: 'SettingApp', show: '设置器'},
  {name: 'SettingApp', show: '设置器'},
  {name: 'SettingApp', show: '设置器'}
];

// 计算属性来获取当前显示的组件
const currentComponent = computed(() => {
  switch (currentApp.value) {
    case 'LoginApp':
      return LoginApp;
      // Add more cases for other apps
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
// bootstrap处理
onBeforeMount(() => {

});

// 页面初始化
onMounted(() => {
  setInterval(() => {
    currentTime.value = new Date().toLocaleString();
  }, 1000);
});

// ! 页面应用逻辑


// ! 页面展示组件


//? 首页支撑逻辑
// 时间
const currentTime = ref(new Date().toLocaleString());

// 搜索
const searchQuery = ref('');

const search = () => {
  console.log('Searching for:', searchQuery.value);
};

// 进入App
const enterWorld = ref(true);
const enterApp = () => {
  enterWorld.value = true;
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


</script>

