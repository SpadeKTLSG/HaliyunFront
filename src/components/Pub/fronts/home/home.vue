<template>
  <div class="mod-home">
    <h1>蛤蜊云网盘 Haliyun Netdisk</h1>
    <div class="mod-home__content">
      <div class="mod-home__content__item">
        <h2>功能</h2>
        <p>
          文件上传、下载、分享、在线预览、在线编辑、文件夹管理、文件搜索、文件回收站、文件历史版本、文件标签、文件评论、文件加密、文件压缩、文件解压缩、文件加解密、文件夹加解密、文件夹压缩、文件夹解压缩、文件夹加解密、文件夹标签、文件夹评论、文件夹搜索、文件夹回收站、文件夹历史版本、文件夹加密、文件夹解密、文件夹分享
        </p>
      </div>
    </div>
    <button @click="$emit('close')">关闭</button>
  </div>
</template>

<script setup>
import './home.scss'
</script>

<style lang="scss" scoped>
</style>
