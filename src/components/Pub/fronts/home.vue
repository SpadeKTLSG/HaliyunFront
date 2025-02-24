<template>
  <div class="home_background">

    <!--1.左侧区域-->
    <div class="home_left">
      <!--1.1大块介绍-->
      <div class="home_left_readme">
        <el-text size="large" type="primary">
          <h2>
            蛤蜊云网盘 Haliyun Netdisk : Readme ↓
          </h2>
        </el-text>
        <el-text size="default">
          <h2>缘由</h2>
          <p>某人的毕设</p>

          <h2>简介</h2>
          <p>基于HDFS的轻量级群组式私密分享网盘
          </p>

          <h2>进度</h2>
          <p>技术攻关完毕, 业务攻关完毕, 数据库和包结构攻关完毕, 前端页面攻坚完毕. 正式进入平稳开发阶段</p>

          <h2>功能</h2>
          <p>文件上传、下载、分享等等, 之后再搬过来</p>

          <h2>技术栈</h2>
          <ul>
            <li>前端: Vue3</li>
            <li>后端: Spring Cloud Alibaba + MyBatis Plus Join</li>
            <li>数据: MySQL + Redis + HDFS</li>
          </ul>

          <h2>项目描述</h2>
          <p> 一个专注解决垂直领域中群组治理与完全私密等需求的 PaaS 网盘，
            综合基础 Spring Cloud Alibaba 与 COLA 框架充血模型优势独立设计了提供用户存储、群组管理、文件分享等功能的
            Flow-Func-Repo 前后端分离式架构。 是继承了 EduExchM 核心思路的个人毕设项目。</p>

        </el-text>
      </div>
    </div>

    <!--2.右侧区域-->
    <div class="home_right">
      <!--2.1上方照片墙-->
      <div class="home_right_show el-box-shadow">

        <!-- 照片展示 -->
        <img alt="Image" src="@/../static/img/首页轮播图集合 (1).png" style="width:80%; height: auto; padding-left: 80px">
      </div>

      <!--2.2下方按钮区域-->
      <div class="home_right_op">
        <!--2.2.1横排三个Link按钮-->
        <div class="home_right_op_buttonList">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-button class="home_right_op_buttons" type="primary" @click="navigateTo('link1')">Link 1</el-button>
            </el-col>
            <el-col :span="8">
              <el-button class="home_right_op_buttons" type="primary" @click="navigateTo('link2')">Link 2</el-button>
            </el-col>
            <el-col :span="8">
              <el-button class="home_right_op_buttons" type="primary" @click="navigateTo('link3')">Link 3</el-button>
            </el-col>
          </el-row>
        </div>
        <!--2.2.2单列一个注销按钮-->
        <div class="home_right_op_logout">
          <el-button class="home_right_op_button_long" type="danger" @click="logout">注销</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

import * as Maven from "@/components/common/maven.js";
import {clearLoginInfo} from "@/components/common/user.js";
import {inject} from "vue";

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

// DI 依赖注入
const currentPage = inject('currentPage');

const navigateTo = (link) => {
  const urls = {
    link1: 'https://github.com/SpadeKTLSG/Haliyun',
    link2: 'https://github.com/SpadeKTLSG/HaliyunFront',
    link3: 'https://github.com/SpadeKTLSG'
  };
  window.open(urls[link], '_blank');
};


const logout = () => {
  // 后端登出
  http({
    url: http.adornUrl('Guest/users/logout'),
    method: 'delete'
  }).then(() => {
    // 前端登出
    clearLoginInfo();
    // 跳转到主页
    currentPage.value = 'login';
  }).catch(() => {
    ElMessage.error('登出失败');
  });
};

</script>

<style lang="scss" scoped>
.home_background {
  display: flex;
  width: 100%;
  height: 100vh;


  .home_left {
    width: 50%;
    padding: 20px;
    border: 1px solid #ccc;
    box-sizing: border-box;
  }

  .home_right {
    width: 50%;
    display: flex;
    flex-direction: column;
    padding: 20px;
    box-sizing: border-box;

    .home_right_show {
      flex: 1;
      margin-bottom: 20px;
      box-shadow: var(--el-box-shadow);
    }

    .home_right_op {
      display: flex;
      flex-direction: column;
      flex: 1;

      .home_right_op_buttonList {
        margin-bottom: 20px;
        display: flex;
        justify-content: center;
        width: 100%;

        .home_right_op_buttons {
          width: 100%;
          display: flex;
          justify-content: center;
        }
      }

      .home_right_op_logout {
        width: 100%;
        display: flex;
        justify-content: center;

        .home_right_op_button_long {
          width: 35%;
        }
      }
    }
  }
}
</style>
