<template>

  <!--主体-->
  <div class="userlevel">

    <!-- 上部区域: 等级金字塔-->
    <div class="userlevel_upper">
      哈哈哈

      <div>
        <!--7级-->
        <el-button @click="showLevelinfo(7)"> 7级</el-button>
      </div>

      <div>
        <!--6级-->
      </div>

      <div>
        <!--5级-->
      </div>

      <div>
        <!--4级-->
      </div>

      <div>
        <!--3级-->
      </div>
      <div>
        <!--2级-->
      </div>

      <div>
        <!--1级-->
      </div>

      <div>
        <!--0级-->
      </div>
    </div>

    <el-divider></el-divider>

    <!-- 下部区域: 等级描述-->
    <div class="userlevel_lower">


    </div>


  </div>
</template>

<script setup>
import * as Maven from '@/components/common/maven.js'
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
  cookie, http, Debounce, ezEncrypt: encrypt
} = Maven);


// DI 依赖注入
const props = defineProps({
  class: String,
});
const emit = defineEmits(['close']);
const currentPage = inject('currentPage');


//? 用户数据展示表单 (对应子页签分区数据) 复用
const userData = ref({});


//! 查

onMounted(() => {
  //初始化展示用户数据: 获得用户当前的等级信息, 并置灰更高等级 + 点亮当前等级
  showLevelinfo();
});

// 用户的等级 floor:
let userLevel;

const getUserLevel = () => {
  http({
    url: http.adornUrl('Guest/users/userslevel/floor'),
    method: 'get'
  }).then(({data}) => {
    userLevel = data;
  }).catch((error) => {
    ElMessage({
      message: '获取用户等级数据失败: ' + error.message,
      type: 'error',
      duration: 1000
    });
  });
};

const showLevelinfo = (level) => {
  http({
    url: http.adornUrl('Guest/levels/levelinfo/floor'),
    method: 'get',
    params: http.adornParams({
      floor: level
    })
  }).then(({data}) => {
    userData.value = data;
  }).catch((error) => {
    ElMessage({
      message: '获取楼层数据失败: ' + error.message,
      type: 'error',
      duration: 1000
    });
  });
};


</script>


<style lang="scss" scoped>

.userlevel {

  .userlevel_upper {
    margin-top: 25px;
    margin-bottom: 20px;


  }


}

</style>
