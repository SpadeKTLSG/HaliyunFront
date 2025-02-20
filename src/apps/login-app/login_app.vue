<template>

  <BaseApp>
    <el-button @click="currentPage = 'login'">登录</el-button>
    <el-button @click="currentPage = 'home'">首页</el-button>

    <Home v-if="currentPage === 'home'" @close="backAppHome"/>
    <Login v-if="currentPage === 'login'" @close="backAppHome"/>
  </BaseApp>

  <!--  先登录, 之后展示主页-->
</template>

<script setup>
import './login_app.scss'
import * as Maven from '@/components/common/maven.js'
//引入组件
import BaseApp from '@/apps/base_app.vue';
import Home from '@/components/Pub/fronts/home/home.vue'
import Login from '@/components/Guest/users/login/login.vue'

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

// 应用内跳页器
const currentPage = ref('login');

// 回退应用主页
const backAppHome = () => {
  currentPage.value = '';
};

</script>
