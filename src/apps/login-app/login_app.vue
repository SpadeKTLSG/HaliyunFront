<template>


  <div class="login_app">

    <!--应用标识-->

    <el-text class="base_header">登录器</el-text>

  </div>

  <!--具体页面-->
  <component :is="currentView" class="login_app_compo" @close="backAppHome"/>

</template>

<script setup>
import * as Maven from '@/components/common/maven.js'
//引入组件
import Home from '@/components/Pub/fronts/home.vue'
import Login from '@/components/Guest/users/login.vue'
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
// 把currentPage暴露出去
provide('currentPage', currentPage);


// 计算属性来获取当前显示的组件
const currentView = computed(() => {
  // 先判断用户是否登录了
  if (localStorage.getItem('id') === '') {
    return Home;
  }
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


</script>

<style lang="scss" scoped>


.login_app {
  display: flex;
  margin-top: -10px;
  flex-direction: column;
  height: 5vh;


  .base_header {
    display: flex;
    justify-content: center;
    align-items: center;
    color: #f91313;
    background-color: #15d41b;
    line-height: 35px;
    font-size: 25px;
    width: 1400px;
    border-radius: 20px;
    opacity: 0.4;

  }


}

//对应页面组件, 需要占满剩下的全部页面.
.login_app_compo {
  flex: 1; /* 使 login_compo 占满剩余空间 */
}

</style>
