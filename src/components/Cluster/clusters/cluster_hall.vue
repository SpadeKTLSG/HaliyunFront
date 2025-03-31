<template>

  <!--主体-->
  <div class="userlevel">

    <!-- 上部区域: 操作按钮集合-->
    <div class="userlevel_upper">

    </div>


    <el-divider></el-divider>

    <!-- 下部区域: 群组展示-->
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


// 群组分页数据展示表单
const pageData = reactive({
  current: 1,
  size: 10,
  total: 0,
  records: []
});


//! 查


onMounted(() => {
  getAllClusterPage();
});


/**
 * 分页获取群组数据
 */

const getAllClusterPage = async (current, size) => {
  try {
    const {data} = await http({
      url: http.adornUrl('Cluster/clusters/hall/all'),
      method: 'get',
      params: {
        current,
        size
      }
    });
    pageData.current = data.current;
    pageData.size = data.size;
    pageData.total = data.total;
    pageData.records = data.records;


    if (pageData.total === 0) {
      ElMessage({
        message: '暂无数据',
        type: 'warning',
        duration: 1000
      });
    }

  } catch (error) {
    ElMessage({
      message: '获取群组大厅数据失败: ' + error.message,
      type: 'error',
      duration: 1000
    });
  }


};


</script>


<style lang="scss" scoped>

.userlevel {

  .userlevel_upper {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 10px;
    margin-bottom: 20px;

    .level {
      display: flex;
      justify-content: center;
      margin-bottom: 10px;

      el-button {
        width: 100% !important;
      }
    }

    .level0 {
      width: 30px !important;
    }

    .level1 {
      width: 50px !important;
    }

    .level2 {
      width: 70px !important;
    }

    .level3 {
      width: 90px !important;
    }

    .level4 {
      width: 110px !important;
    }

    .level5 {
      width: 130px !important;
    }

    .level6 {
      width: 150px !important;
    }

    .level7 {
      width: 170px !important;
    }
  }
}

.simple_text_red {
  padding: 25px;
  font-size: 20px;
  font-weight: bold;
  color: #ee0b1a;
}
</style>
