<template>

  <!--主体-->
  <div class="userfunc">

    <!-- 上部区域-->
    <div class="userfunc_upper">


      <el-text class="userfunc-title">会员</el-text>
      <el-col :span="8" class="userfunc-basic">
        <el-descriptions :column="2" border>

          <el-descriptions-item label="会员">{{ vipDescription }}</el-descriptions-item>

        </el-descriptions>

      </el-col>


    </div>

    <el-divider></el-divider>


    <el-text class="userfunc-info">会员功能暂不成熟, 下面是早期的会员功能</el-text>


    <el-table :data="vipFuncList" stripe border fit height="500" class="userfunc-table">
      <el-table-column prop="name" label="功能"></el-table-column>
      <el-table-column prop="description" label="描述"></el-table-column>
    </el-table>
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


//? 用户数据展示表单 (对应子页签分区数据) 复用
const userData = ref({
  levelId: '-/-', //后端会传不展示
  levelName: '-/-',
  levelFloor: '-/-',
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

//? 写死的VIP用户功能列表
// todo, 想啊, 很想啊
const vipFuncList = [
  {name: 'VIP1', description: 'VIP1 功能描述'},
  {name: 'VIP2', description: 'VIP2 功能描述'},
  {name: 'VIP3', description: 'VIP3 功能描述'},
  {name: 'VIP4', description: 'VIP4 功能描述'},
  {name: 'VIP5', description: 'VIP5 功能描述'},
  {name: 'VIP6', description: 'VIP6 功能描述'},
  {name: 'VIP7', description: 'VIP7 功能描述'},
  {name: 'VIP8', description: 'VIP8 功能描述'},
  {name: 'VIP9', description: 'VIP9 功能描述'},
  {name: 'VIP10', description: 'VIP10 功能描述'},
];


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

  .userfunc-info {
    margin-top: 20px;
    font-size: 15px;
    font-weight: bold;
    color: #7cfc00;
  }

  .userfunc-table {
    margin-top: 20px;
  }
}

</style>
