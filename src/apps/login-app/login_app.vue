<template>
  <div>
    <el-text class="temp">
      轴心框架 - 页面模板
    </el-text>
  </div>
  <Home v-if="currentPage === 'home'" @close="indexBack()"/>
  <Login v-if="currentPage === 'login'" @close="indexBack()"/>


  <!--  先登录, 之后展示主页-->
</template>

<script setup>
import './login_app.scss'
import * as Maven from '@/components/common/maven.js'
//引入组件
import Home from '../../components/Pub/fronts/home/home.vue'
import Login from '../../components/Guest/users/login/login.vue'

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


//App pid
const app_pid = 'login_app';


let showingSth = false
const currentPage = ref('')

const indexBack = () => {
  currentPage.value = ''
  showingSth = !showingSth
}

</script>
