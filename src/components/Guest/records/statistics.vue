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
            @click="refreshStatistics()"
        >
          刷新
        </el-button>

        <el-text class="simple_text_red">
         用户记录
        </el-text>

      </span>

      <el-divider></el-divider>

    </div>


    <!-- 下部区域-->
    <div class="user_record_app_lower">

      <div class="statistics-card">

        <el-card class="box-card">

          <div slot="header" class="clearfix">
            <span>统计信息</span>
          </div>

          <el-row :gutter="20">
            <el-col :span="30">
              <p><strong>累计评论次数:</strong> {{ statisticsData.comment }}</p>
              <p><strong>累计下载次数:</strong> {{ statisticsData.download }}</p>
              <p><strong>累计上传次数:</strong> {{ statisticsData.upload }}</p>
              <p><strong>累计活动参加次数:</strong> {{ statisticsData.outlet }}</p>
              <p><strong>累计发私信次数:</strong> {{ statisticsData.mail }}</p>
              <p><strong>累计收藏次数:</strong> {{ statisticsData.collect }}</p>
              <p><strong>累计点赞次数:</strong> {{ statisticsData.likes }}</p>
              <p><strong>累计干坏事次数:</strong> {{ statisticsData.trick }}</p>
            </el-col>
          </el-row>

          <el-divider></el-divider>

          <el-button type="primary" @click="refreshStatistics">刷新</el-button>

        </el-card>

      </div>

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
  refreshStatistics();
});

// ! List

const statisticsData = ref({
  id: '',
  userId: '',
  comment: 0,
  download: 0,
  upload: 0,
  outlet: 0,
  mail: 0,
  collect: 0,
  likes: 0,
  trick: 0,
});

const refreshStatistics = async () => {
  http({
    // 查询详情的接口复用的, 这里需要手动处理一下传递的Map过程
    url: http.adornUrl('Guest/records/statistic/user_show'),
    method: 'get',
    params: {
      targetUserId: BigInt(UserContext.getUserId()),
    }
  }).then(({data}) => {

    // 直接复制
    statisticsData.value = data;

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

    .statistics-card {
      margin: 20px;

      .box-card {
        width: 100%;
      }
    }


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
