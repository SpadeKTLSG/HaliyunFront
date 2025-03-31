<template>

  <!--主体-->
  <div class="usercollect">

    <!-- 上部区域: -->
    <div class="usercollect_upper">
      <el-text class="simple_text_red"> 用户收藏类型与数量统计</el-text>
      <!--      todo 后端给我加个缓存啊混蛋这个很吃性能  -->

      <el-table :data="[tableData]" style="width: 90%">
        <el-table-column prop="postCount" label="动态收藏数量"></el-table-column>
        <el-table-column prop="fileCount" label="文件收藏数量"></el-table-column>
        <el-table-column prop="clusterCount" label="群组收藏数量"></el-table-column>
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
const tableData = reactive({
  postCount: -1,
  fileCount: -1,
  clusterCount: -1
});


//! 查


onMounted(() => {
  // 收藏导览页面, 拉取用户收藏的总览信息; 具体子页面进行分页查询展示数据
  getUserDataOfAllCollect();
});


const getUserDataOfAllCollect = () => {
  http({
    url: http.adornUrl('Guest/datas/collect/count'),
    method: 'get'
  }).then(({data}) => {
    // 处理响应数据
    tableData.postCount = data.postCount;
    tableData.fileCount = data.fileCount;
    tableData.clusterCount = data.clusterCount;
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

.usercollect {

  .usercollect_upper {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: -200px;
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
  padding: 15px;
  font-size: 20px;
  font-weight: bold;
  color: #ee0b1a;
}

</style>
