<template>

  <!--  1头部区域 (持久化) -->

  <!--  2主体区域 (切换区域)-->

  <!--  2.0应用名称 -->

  <!--  2.1搜索框(随处搜索) -->

  <!--  2.2App列表区域 页面宽度动态排列, 超过了滚动 -->

  <div>
    <el-text v-if="!showingSth" class="test">这是首页</el-text>
    <el-button v-if="!showingSth" @click="showPage('home')">Home</el-button>
    <el-button v-if="!showingSth" @click="showPage('login')">Login</el-button>
    <el-button v-if="!showingSth" @click="showPage('404')">404</el-button>


  </div>


  <!--  3底部操作栏 (持久化) -->


  <!--  A 遮罩欢迎页面 -->

  <!--  A1 广告-滚动个人介绍 -->

  <!--  A2 跳过区域-->

</template>

<script setup>
import './App.scss'
import * as Maven from '@/components/common/maven.js'

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
// 引入应用

//


// !页面初始化逻辑
// bootstrap处理
onBeforeMount = () => {

}

// 页面初始化
onMounted = () => {

}

// !页面应用逻辑


// ? 页面展示栈组件
// note: 需要一个栈组件, 当用户在App里面打开应用之后, 将对应的应用页面pid压入栈中, 当用户点击返回按钮时, 从栈中弹出pid, 并且关闭对应的应用页面, 取出栈顶的pid, 并且打开对应的应用页面
// 当栈空的时候, 说明返回App

//栈
const pageStack = ref([])

let showingSth = false
const currentPage = ref('')

const showPage = (page) => {
  currentPage.value = page
  showingSth = !showingSth
}

const indexBack = () => {
  currentPage.value = ''
  showingSth = !showingSth
}


</script>

