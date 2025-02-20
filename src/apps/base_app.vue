<template>
  <div>
    <el-text class="temp">轴心框架 - 页面模板</el-text>
    <slot></slot>
    <button @click="$emit('close')">关闭应用</button>
  </div>
</template>

<script setup>

defineProps();
defineEmits(['close']);

</script>
