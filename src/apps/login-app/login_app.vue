<template>


  <div class="login_app">

    <!--应用标识-->

    <el-text class="base_header">登录器</el-text>

  </div>

  <!--具体页面-->
  <component :is="currentView" class="login_compo" @close="backAppHome"/>

</template>

<script setup>
import './login_app.scss'
import * as Maven from '@/components/common/maven.js'
//引入组件
import Home from '@/components/Pub/fronts/home/home.vue'
import Login from '@/components/Guest/users/login/login.vue'
import {provide} from 'vue'

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


defineEmits(['close']);
// 应用内跳页器
const currentPage = ref('login');

// 计算属性来获取当前显示的组件
const currentView = computed(() => {
  switch (currentPage.value) {
    case 'home':
      return Home;
    case 'login':
    default:
      return Login;
  }
});

// 回退应用主页
const backAppHome = () => {
  currentPage.value = '';
};

// 把currentPage暴露出去
provide('currentPage', currentPage);
</script>
