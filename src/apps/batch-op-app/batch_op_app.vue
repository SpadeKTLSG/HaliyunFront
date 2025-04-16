<template>


  <div class="batch_op_app">

    <!--应用标识-->
    <el-text class="base_header">批量处理</el-text>

  </div>

  <!--左侧导航区域-->
  <div class="batch_op_app_left_nav">

    <el-menu default-active="1" class="el-menu-vertical" @select="handleMenuSelect">
      <!--一级菜单-->
      <el-menu-item index="1">
        I. 批量文件操作
      </el-menu-item>
    </el-menu>

  </div>

  <!--具体页面-->
  <component :is="currentView" class="batch_op_app_compo" @close="backAppHome"/>

</template>

<script setup>
import * as Maven from '@/components/common/maven.js'
//引入组件
import {provide} from 'vue'

import ClusterFile from "@/components/Data/files/cluster_file.vue";
import Tofinish from "@/components/Pub/fronts/tofinish.vue";
import {UserContext} from "@/components/common/user.js";

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


//!进入特定应用的鉴权
onBeforeMount(() => {
  //暂时先针对登陆进行鉴权, 之后还能加入对应的权限鉴权
  // 统一 登陆状态拦阻索: 如果用户未登录, 展示三秒弹框提示: 未登录, 之后踢回首页
  if (!UserContext.hasUser()) {
    ElMessage({
      message: '未登录, 请先登录',
      type: 'warning',
      duration: 3000
    });
    nextTick(() => {
      setTimeout(() => {
        window.location.replace('http://localhost:9876/');
      }, 3000);
    });
  }
});


defineEmits(['close']);

// 应用内跳页器, 暴露出去
const currentPage = ref('clusterfile');
provide('currentPage', currentPage);


// 处理左侧导航栏点击事件
const handleMenuSelect = (index) => {
  if (index === '1') {
    currentPage.value = 'clusterfile';
  } else {
    currentPage.value = 'wait';
  }
};


// 计算属性来获取当前显示的组件
const currentView = computed(() => {
  switch (currentPage.value) {
    case 'clusterfile':
      return ClusterFile;
    case 'wait':
      return Tofinish;
    default:
      return ClusterFile;
  }
});

// 回退应用主页
const backAppHome = () => {
  currentPage.value = '';
};

</script>

<style lang="scss" scoped>


.batch_op_app {
  display: flex;
  margin-top: -10px;
  flex-direction: row;
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

.batch_op_app_left_nav {
  width: 10%;
  margin-left: -150px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  .el-menu-vertical {
    width: 100%;
  }
}

//对应页面组件, 需要占满剩下的全部页面.
.batch_op_app_compo {
  flex: 1; /* 使 login_compo 占满剩余空间 */
  display: flex;
  flex-direction: column;
  // 纵向顶到最上面
  width: 90%;
}


</style>
