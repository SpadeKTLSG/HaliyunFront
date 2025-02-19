<template>
  <div class="site-wrapper site-page--not-found">
    <div class="site-content__wrapper">
      <div class="site-content">

        <h2 class="not-found-title">
          400
        </h2>

        <p class="not-found-desc">
          抱歉！您访问的页面<em>失联</em>啦 ...
        </p>
        <el-button>
          返回上一页
        </el-button>

        <el-button
            class="not-found-btn-gohome"
            type="primary"
        >
          进入首页
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import './404.scss'
</script>
