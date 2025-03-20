<template>

</template>

<script setup>
import * as Maven from '@/components/common/maven.js'
import {inject} from "vue";
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
  cookie, http, Debounce, ezEncrypt: encrypt
} = Maven);


// DI 依赖注入
const props = defineProps({
  class: String,
});
const emit = defineEmits(['close']);
const currentPage = inject('currentPage');


//? 用户数据展示表单 (对应子页签分区数据)
const userData = ref({
  //UserFunc表

  //1. 等级
  levelId: '-/-', //后端会传不展示
  levelName: '-/-',

  //2. 会员
  vip: '-/-',

  //3. 群组
  createGroupCount: '-/-',
  createGroupMax: '-/-',
  joinGroupCount: '-/-',
  joinGroupMax: '-/-',

  //4. 资产
  coin: '-/-',
  energyCoin: '-/-',

  //5. 推广
  registerCode: '-/-'

  //6-X. 敬请期待
});

//? 数据转义显示
const vipDescription = computed(() => {
  switch (userData.value.status) {
    case 0:
      return '普通用户';
    case 1:
      return '会员用户';
    default:
      return '未知请联系管理员';
  }
});

//! 查

onMounted(() => {
  getData();
});

//和 Detail 一样, 也是获取用户数据, 但是还需要拿 Level 的等级名称信息, 包给后端处理. 后面加缓存实现优化
const getData = () => {
  http({
    url: http.adornUrl('Guest/users/user_info'),
    method: 'get',
    params: http.adornParams({
      id: UserContext.getUserId(),
    })
  }).then(({data}) => {
    userData.value = data;
  }).catch((error) => {
    ElMessage({
      message: '获取用户数据失败: ' + error.message,
      type: 'error',
      duration: 1000
    });
  });
};


</script>


<style lang="scss" scoped>

</style>
