<template>

  <!--主体-->
  <div class="usercollect">

    <!-- 上部区域: -->
    <div class="usercollect_upper">
      <el-text class="simple_text_red"> 用户收藏类型与数量统计</el-text>
      <!--      todo 后端给我加个缓存啊混蛋这个很吃性能  -->

      <el-table>
        <!--        todo-->
      </el-table>

    </div>


    <el-divider></el-divider>

    <!-- 下部区域: 具体收藏介绍与操作指引-->
    <div class="usercollect_lower">
      <el-text class="simple_text_red"> <=== 请点击左侧列表查看具体收藏类型下的内容...</el-text>
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
const tableData = ref({
  postCount: 0,
  fileCount: 0,
  groupCount: 0,
});


//! 查


onMounted(() => {
  getUserDataCollectCount();
});


const getUserDataCollectCount = () => {
  http({
    url: http.adornUrl('Guest/levels/levelinfo/floor'),
    method: 'get',
    params: http.adornParams({
      floor: level
    })
  }).then(({data}) => {
    levelData.value = data;
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

.usercollect {

  .usercollect_upper {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 10px;
    margin-bottom: 20px;
  }

  .usercollect_lower {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 10px;
    margin-bottom: 20px;
  }


}


.simple_text_red {
  font-size: 20px;
  font-weight: bold;
  color: #ee0b1a;
}

</style>
