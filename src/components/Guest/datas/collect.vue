<template>

  <!--主体-->
  <div class="userlevel">

    <!-- 上部区域: -->
    <div class="userlevel_upper">
      <el-text> 用户收藏类型与数量统计</el-text>
      <!--      todo 后端给我加个缓存啊混蛋这个很吃性能  -->


    </div>


    <el-divider></el-divider>

    <!-- 下部区域: 具体收藏介绍与操作指引-->
    <div class="userlevel_lower">
      <el-text> <=== 请点击左侧列表查看具体收藏类型下的内容...</el-text>
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


//? 用户数据展示表单 (对应子页签分区数据) 复用
const levelData = ref({
  cut: 1,
  desc: "就是个寄吧",
  floor: 0,
  grow: 50,
  id: "1894667686932631600",
  name: "青铜",
  remark: "新人入职转生"
});

// 用户的等级 floor:
const userLevel = ref(0);

//! 查

onBeforeMount(() => {
  getUserLevel();
});

onMounted(() => {
  showLevelinfo(userLevel.value);
});


/**
 * 获取用户等级数据
 */
const getUserLevel = () => {
  http({
    url: http.adornUrl('Guest/users/userslevel/floor'),
    method: 'get',
    params: http.adornParams({
      id: UserContext.getUserId()
    })
  }).then(({data}) => {
    userLevel.value = data;
  }).catch((error) => {
    ElMessage({
      message: '获取用户等级数据失败: ' + error.message,
      type: 'error',
      duration: 1000
    });
  });
};


/**
 * 展示等级信息
 */
const showLevelinfo = (level) => {
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

const computedLevelData = computed(() => levelData.value);


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

  }
}

</style>
