<template>

  <!--主体-->
  <div class="userfunc">

    <!-- 上部区域-->
    <div class="userfunc_upper">

      <!--用户Func表信息-->

      <!--1.等级-->
      <el-text class="userfunc-title">等级</el-text>
      <el-col :span="8" class="userfunc-basic">
        <el-descriptions :column="2" border>

          <el-descriptions-item label="等级名">{{ userData.levelName }}</el-descriptions-item>
          <el-descriptions-item label="等级"> {{ userData.levelFloor }}</el-descriptions-item>

        </el-descriptions>
      </el-col>


      <!--2.会员-->
      <el-text class="userfunc-title">会员</el-text>
      <el-col :span="8" class="userfunc-basic">
        <el-descriptions :column="2" border>

          <el-descriptions-item label="会员">{{ vipDescription }}</el-descriptions-item>

        </el-descriptions>

      </el-col>

      <!--3.群组-->
      <el-text class="userfunc-title">群组</el-text>
      <el-col :span="8" class="userfunc-basic">
        <el-descriptions :column="2" border>

          <el-descriptions-item label="创建群组数">{{ userData.createGroupCount }}</el-descriptions-item>
          <el-descriptions-item label="最大创建数">{{ userData.createGroupMax }}</el-descriptions-item>
          <el-descriptions-item label="加入群组数">{{ userData.joinGroupCount }}</el-descriptions-item>
          <el-descriptions-item label="最大加入数">{{ userData.joinGroupMax }}</el-descriptions-item>

        </el-descriptions>
      </el-col>


      <!--4.资产-->
      <el-text class="userfunc-title">资产</el-text>
      <el-col :span="8" class="userfunc-basic">
        <el-descriptions :column="2" border>

          <el-descriptions-item label="金币">{{ userData.coin }}</el-descriptions-item>
          <el-descriptions-item label="能量币">{{ userData.energyCoin }}</el-descriptions-item>

        </el-descriptions>
      </el-col>


      <!--5.推广-->
      <el-text class="userfunc-title">推广</el-text>
      <el-col :span="8" class="userfunc-basic">
        <el-descriptions :column="2" border>

          <el-descriptions-item label="推广码">{{ userData.registerCode }}</el-descriptions-item>

        </el-descriptions>
      </el-col>


      <!--6-X 敬请期待-->
      <el-text class="userfunc-title">敬请期待...</el-text>

    </div>
    <el-divider></el-divider>

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


//? 用户数据展示表单 (对应子页签分区数据)
const userData = ref({
  //UserFunc表

  //1. 等级
  levelId: '-/-', //后端会传不展示
  levelName: '-/-',
  levelFloor: '-/-',

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
  switch (userData.value.vip) {
    case 0:
      return '普通用户';
    case 1:
      return '会员用户';
    default:
      return '未知, 请联系管理员';
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

.userfunc {

  .userfunc_upper {
    margin-top: -30%;
    margin-bottom: 20px;

    .userfunc-title {
      width: 100%;
      margin: 10px 0;
      font-size: 20px;
      font-weight: bold;
      color: #17b9e0;
    }

    .userfunc-basic {
      margin: 10px 0;
    }
  }
}

</style>
