<template>

  <!--  1头部区域 (持久化) -->

  <!--  2主体区域 (切换区域)-->

  <!--  2.0应用名称 -->

  <!--  2.1搜索框(随处搜索) -->

  <!--  2.2App列表区域 页面宽度动态排列, 超过了滚动 -->

  <!--  <div v-if="onlyApp">-->
  <!--    <el-text class="test">这是首页</el-text>-->
  <!--    <el-button @click="openApp('LoginApp')">应用</el-button>-->


  <!--  </div>-->


  <!--  3底部操作栏 (持久化, 动态设置操作按钮) -->


  <!--  A 遮罩欢迎页面 -->

  <!--  A1 广告-滚动个人介绍 -->

  <!--  A2 跳过区域-->


  <!--  B 对应应用组件页面-->

  <!--  <component :is="currentApp" v-if="currentApp" @close="closeApp"/>-->


</template>

<script setup>
import './App.scss'
import * as Maven from '@/components/common/maven.js'
//! 应用/组件编排逻辑
// 应用集
import LoginApp from "@/apps/login-app/login_app.vue";

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

// !页面初始化逻辑
// bootstrap处理
onBeforeMount = () => {

}

// 页面初始化
onMounted = () => {

}

// !页面应用逻辑


// ? 页面展示栈组件
const pageStack = ref([])
const currentApp = ref(null); // 当前页面App

//是否只有当前App主页
let onlyApp = computed(() => {
  return pageStack.value.length === 0;
});

/**
 * 显示页面: 将对应的应用压入栈中, 并且打开对应的应用页面
 */
const openApp = (page) => {
  let component;
  // 根据页面名称选择对应的应用
  switch (page) {
    case 'LoginApp':
      component = LoginApp;
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


</script>

