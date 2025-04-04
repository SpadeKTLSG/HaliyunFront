<template>

  <!--主体-->
  <div class="userlevel">

    <!-- 上部区域: 等级金字塔-->
    <div class="userlevel_upper">
      <div class="level" v-for="level in 8" :key="level">
        <el-button @click="showLevelinfo( 8-level)"
                   :class="'level' + (level - 1)"
                   :round="true"
                   :size="'large'">
          {{ 8 - level }}级
        </el-button>
      </div>
    </div>


    <el-divider></el-divider>

    <!-- 下部区域: 等级描述-->
    <div class="userlevel_lower">
      <el-table v-if="computedLevelData" :data="[computedLevelData]" style="width: 100%">
        <el-table-column prop="name" label="等级名称"></el-table-column>
        <el-table-column prop="cut" label="折扣优惠小数倍率"></el-table-column>
        <el-table-column prop="grow" label="到下一级需要成长值"></el-table-column>
        <el-table-column prop="desc" label="等级描述"></el-table-column>
        <el-table-column prop="remark" label="等级备注"></el-table-column>
      </el-table>
      <el-text v-else> 等级数据加载中...</el-text>
    </div>

    <div>
      <el-text class="simple_text_red">等级信息</el-text>
    </div>
    <el-text class="simple_text_red"> 您的等级为 {{ stackLevelData.value }}</el-text>
    <el-text class="simple_text_red"> 选中的等级为 {{ computedLevelData.floor }}</el-text>


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
  id: 1894667686932631600n,
  name: "青铜",
  remark: "新人入职转生"
});

// 用户的等级 floor:
const userLevel = ref(0);
const level = ref(0);

//! 查


onMounted(() => {
  getUserLevel();
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
    showLevelinfo(userLevel.value);
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

        levelData.value = {
          ...data,
          id: BigInt(data.id) // 将 id 转换为 BigInt 类型
        }

      }
  ).catch((error) => {
    ElMessage({
      message: '获取楼层数据失败: ' + error.message,
      type: 'error',
      duration: 1000
    });
  });
};

// 监听用户等级变化
const computedLevelData = computed(() => levelData.value);
const stackLevelData = computed(() => userLevel);

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
