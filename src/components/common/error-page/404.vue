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
        <el-button
            class="not-found-btn-gohome"
            type="primary"
            @click="$emit('close')"
        >
          滚回去
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import './404.scss'
</script>

<style lang="scss" scoped>
</style>
