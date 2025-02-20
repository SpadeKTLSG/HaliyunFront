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
          <div v-if="onlyApp" class="only-app">

            <!-- 2.0 应用名称 + LOGO-->
            <div class="app-name">Haliyun网盘</div>
            <div class="app-logo"/>

            <!-- 2.1 搜索框 -->
            <el-input
                v-model="searchQuery"
                class="search-box"
                placeholder="随处搜索"
                @keyup.enter="search"
            >
              <el-icon slot="suffix" class="search-icon"></el-icon>
            </el-input>

            <!-- 2.2 App列表区域 页面宽度动态排列, 超过了滚动 -->
            <div class="app-list">
              <el-button v-for="app in apps" :key="app.name" @click="openApp(app.name)">
                <el-icon :class="app.icon"></el-icon>
                <span>{{ app.name }}</span>
              </el-button>
            </div>

            <!-- 2.3 填充应用区域到下方的空白 -->
            <div class="spacer"></div>

            <!-- 2.4 右下角设置按钮 -->
            <el-button class="settings-button" @click="openApp('SettingApp')">
              <el-icon class="settings-icon"></el-icon>
            </el-button>

          </div>
          <!-- B 对应应用组件页面 -->
          <transition name="fade">
            <component :is="currentApp" v-if="currentApp" @close="closeApp"/>
          </transition>
        </el-main>

        <!-- 3 底部操作栏 (持久化 | 动态设置操作按钮) -->
        <el-footer class="footer">
          <!--todo, 这三个按钮是在一个 圆角的矩形里面, 这个矩形紧贴下方正中位置-->
          <!-- 3.1 应用功能列表按钮-->
          <el-button class="footer-button" @click="showAllApps">
            <el-icon class="all-apps-icon"></el-icon>
          </el-button>
          <!-- 3.2 回退到这个App.vue主页(清空栈)按钮-->
          <el-button class="footer-button" @click="showCurrentApp">
            <el-icon class="current-app-icon"></el-icon>
          </el-button>
          <!-- 3.3 回退App按钮(出栈)-->
          <el-button class="footer-button" @click="goBack">
            <el-icon class="back-icon"></el-icon>
          </el-button>
        </el-footer>
      </el-container>
    </div>

    <!-- A 宣传主页 - 背景 -->
    <div v-if="!enterWorld" class="welcome-screen">
      <!--  A1 滚动图片框 (2s滚动一次)-->

      <div class="scrolling-images">
        <!-- Add your images here todo-->
      </div>

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
import {ChatDotRound, Suitcase} from "@element-plus/icons-vue";


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


//! 应用/组件编排逻辑
// 应用集
const apps = [
  {name: 'LoginApp', icon: 'login-icon'},
  {name: 'SettingApp', icon: 'settings-icon'},
  // Add more apps here
];


// !页面初始化逻辑
// bootstrap处理
onBeforeMount(() => {

});

// 页面初始化
onMounted(() => {
  setInterval(() => {
    currentTime.value = new Date().toLocaleString();
  }, 1000);
});

// !页面应用逻辑


// ? 页面展示栈组件
const pageStack = ref([]);
const currentApp = ref(null); // 当前页面App

//是否只有当前App主页
let onlyApp = computed(() => {
  return pageStack.value.length === 0;
});

/**
 * 显示页面: 将对应的应用压入栈中, 并且打开对应的应用页面
 */
const openApp = (appName) => {
  let component;
  // 根据页面名称选择对应的应用
  switch (appName) {
    case 'LoginApp':
      component = LoginApp;
      break;
    case 'Settings':
      //todo
      // Add Settings component import here
      break;
    default:
      component = null;
  }
  // 如果存在则压入栈中
  if (component) {
    pageStack.value.push(component);
    currentApp.value = component;
  }
}

/**
 * 关闭页面: 从栈中弹出页面, 如果非空则打开栈顶页面
 */
const closeApp = () => {
  pageStack.value.pop();
  currentApp.value = pageStack.value.length ? pageStack.value[pageStack.value.length - 1] : null;
};


//! 首页支撑逻辑
// 时间
const currentTime = ref(new Date().toLocaleString());

// 搜索
const searchQuery = ref('');

const search = () => {
  console.log('Searching for:', searchQuery.value);
};

// 进入App
const enterWorld = ref(false);
const enterApp = () => {
  enterWorld.value = true;
};


//! 操作栏功能
const showAllApps = () => {
  console.log('Showing all apps');
};

const showCurrentApp = () => {
  console.log('Showing current app');
};

const goBack = () => {
  closeApp();
};


</script>

