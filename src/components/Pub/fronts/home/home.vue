<template>
  <div class="home_background">

    <div class="home_left">
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
    <div class="home_right">
      <div class="home_right_show">
      </div>


      <div class="home_right_op">
      </div>
    </div>
  </div>
</template>

<script setup>
import './home.scss'
</script>

<style lang="scss" scoped>
</style>
