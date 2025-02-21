<template>
  <div>
    <el-header class="base_header">
      <div class="title"></div>

    </el-header>
    <slot></slot>

  </div>
</template>

<script setup>

defineProps();
defineEmits(['close']);
// @click="$emit('close')" //todo 这个写在对应的组件里面, 实现App内的跳页

</script>

<style scoped>
.base_header {
  background-color: #66e90e;
  color: #f91313;
  line-height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title {
  font-size: 10px;
}
</style>
