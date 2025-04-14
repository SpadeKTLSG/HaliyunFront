<template>


  <!--主体-->
  <div class="user_record_app">

    <!-- 上部区域-->
    <div class="user_record_app_upper">


      <span>
        <!--刷新-->
        <el-button
            type="primary"
            class="refresh_button"
            @click="queryMyReocrd()"
        >
          刷新
        </el-button>

      </span>


    </div>


    <el-divider></el-divider>

    <!-- 下部区域-->
    <div class="user_record_app_lower">

      <el-table :data="myRecordData" style="width: 90%">

        <el-table-column prop="header" label="标题"></el-table-column>


      </el-table>

    </div>

  </div>


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


// ! Refresh
onMounted(() => {
  queryMyReocrd();
});

// ! List

const myRecordData = ref([]);

const queryMyReocrd = async () => {
  http({
    // 查询详情的接口复用的, 这里需要手动处理一下传递的Map过程
    url: http.adornUrl('Guest/records/statistic/user_show'),
    method: 'get',
    params: {
      targetUserId: BigInt(UserContext.getUserId()),
    }
  }).then(({data}) => {

    // 直接复制
    myRecordData.value = data;

  }).catch((error) => {
    ElMessage({
      message: '获取用户记录失败: ' + error.message,
      type: 'error',
      duration: 3000
    });
  });
};


</script>

<style lang="scss" scoped>

.user_record_app {

  .user_record_app_upper {
    display: flex;
    flex-direction: column;

    margin-top: -80px;
    margin-bottom: 5px;


    .refresh_button {
      width: 30px;
    }

  }

  .user_record_app_lower {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 10px;
    margin-bottom: 20px;
  }
}

.simple_text_red {
  margin: 5px;
  padding: 25px;
  font-size: 20px;
  font-weight: bold;
  color: #ee0b1a;
}


</style>
