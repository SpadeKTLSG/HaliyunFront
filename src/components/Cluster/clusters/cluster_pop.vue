<template>

  <!--主体-->
  <div class="clusterpop">

    <!-- 上部区域: 查询引导集合-->
    <div class="clusterpop_upper">


      <!-- 搜索输入下拉框 -->
      <el-select v-model="selectedGroupId"
                 filterable
                 remote
                 :remote-method="searchGroups"
                 @keyup.enter="searchGroups"
                 placeholder="搜索或选择群组"
                 class="clusterpop_selector"
      >

        <el-option v-for="item in groupOptions"
                   :key="item.id"
                   :label="item.name"
                   :value="item.id">
        </el-option>

      </el-select>


      <!-- 群名称显示 -->
      <span class="clusterpop_name">
        <el-text type="primary" class="simple_text_red">
          群组名称:
        {{ (selectedGroup.name !== "") ? selectedGroup.name : "请在左侧选择" }}
        </el-text>
      </span>

      <!-- 群容量 百分比 -->
      <span class="clusterpop_name">
        <el-text type="primary" class="simple_text_red">
          群组容量: {{ groupCapacityPercentage }}%
        </el-text>
      </span>

    </div>


    <el-divider></el-divider>

    <!-- 下部区域: 群组人员展示 (这个页面之后在管理群的时候会被经常复用简单模式) -->
    <div class="clusterpop_lower">

      <!-- 头像矩阵排列 -->
      <div class="clusterpop_lower">

        <el-card class="avatar-card" shadow="hover">

          <!-- 头像矩阵排列对象 -->
          <div class="avatar-grid">

            <div v-for="member in pageData.records"
                 :key="member.id"
                 class="avatar-item"
                 @click="viewMemberDetails(member)"
            >

              <!--<el-image :src="member.avatar" alt=""/>-->
              <!--经费原因, 先用统一的用户图片-->
              <img src="@/../static/img/PopAvatarPic.png" alt="用户头像" style="width: 100px; height: 100px; border-radius: 50%;"/>

              <span>{{ member.account }}</span>

            </div>

          </div>

        </el-card>

      </div>

      <!-- 分页器 -->
      <el-pagination
          layout="total, prev, pager, next"
          v-model:current-page="pageData.current"
          :page-size="pageData.size"
          :total="pageData.total"
          style="margin-top: 20px;"
      />
    </div>


    <!-- 用户信息弹框 -->
    <el-dialog
        v-model="memberDialogVisible"
        title="用户详情">
      <!-- 用户信息展示 -->
      <el-descriptions :column="2" border size="small">
        <el-descriptions-item label="账号">{{ selectedMember.account }}</el-descriptions-item>
        <el-descriptions-item label="昵称">{{ selectedMember.nickname }}</el-descriptions-item>
        <!-- ...其他用户信息... -->
      </el-descriptions>
      <!-- 操作按钮 -->
      <el-button type="danger" @click="showKickoutDialog()">将其踢出群聊</el-button>
    </el-dialog>


    <!-- 踢出群组确认对话框 -->
    <el-dialog
        v-model="kickoutDialogVisible"
        title="加入群组"
    >

      <p>确认将这家伙 {{ selectedMember.account }} 踢出群组 ?</p>

      <span slot="footer" class="dialog-footer">
        <el-button @click="kickoutDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmKickout()">确认</el-button>
      </span>

    </el-dialog>


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


//! 首次实践: 相邻的业务在一起, 而不是同类型放一起的js写法


//? 上部 搜索输入下拉框

// 选中的群组信息
const selectedGroupId = ref(null); // 选中的群组id
const groupOptions = ref([]); // 群组列表

// 选中的群组数据 (id查)
const selectedGroup = ref({

  // Cluster
  id: 0n,
  name: '',
  nickname: '',
  pic: '',
  popVolume: 0,

  // ClusterFunc
  allowInvite: 0,

  // Creator
  userAccount: '',
  userIsAdmin: 0,

});


onMounted(
    //初始需要先获取用户加入的群组列表
    () => {
      searchGroups();
    }
);
// 查询用户加入的群组列表
const searchGroups = () => {
  try {
    const {data} = http({
      url: http.adornUrl('Cluster/clusters/search'),
      method: 'get'
    });
    groupOptions.value = data.records; // 回填选择框
  } catch (error) {
    ElMessage({
      message: '获取用户加入群组失败: ' + error.message,
      type: 'error',
      duration: 1000
    });
  }
};


//? 下部 头像矩阵排列

const selectedMember = ref({
  id: 0n,

}); // 选中的成员信息存储

// 人员信息分页数据展示表单
const pageData = reactive({
  current: 1,
  size: 10,
  total: 0,
  records: []
});


//? 人员具体信息查询

const memberDialogVisible = ref(false);

// 显示成员详情对话框
const viewMemberDetails = (member) => {
  selectedMember.value = member;
  memberDialogVisible.value = true;
};


// 群组容量百分比
const groupCapacityPercentage = computed(() => {
  return (selectedGroup.value.popVolume / selectedGroup.value.totalSpace) * 100;
});


//? 踢出人员操作

const kickoutDialogVisible = ref(false);

// 显示踢出对话框
const showKickoutDialog = () => {
  // 由于已经打开了成员详情对话框, 直接继续打开即可, 使用已经选择的对象信息
  kickoutDialogVisible.value = true;
};


// 确认踢出操作
const confirmKickout = () => {
  kickOutMember(selectedMember.value.id);
  kickoutDialogVisible.value = false;
};

// 踢出成员
const kickOutMember = (memberId) => {
  try {
    http({
      url: http.adornUrl('Cluster/clusters/kick'),
      method: 'post',
      params: {memberId}
    });

    memberDialogVisible.value = false;
  } catch (error) {
    ElMessage({
      message: '踢出群聊失败: ' + error.message,
      type: 'error',
      duration: 1000
    });
  }
}

</script>


<style lang="scss" scoped>

.clusterpop {

  .clusterpop_upper {
    display: flex;
    align-items: center;
    margin-top: -30px;
    margin-bottom: 5px;

    .clusterpop_selector {
      width: 20%;
      margin-right: 10px;
      margin-left: 20px;
    }

    .clusterpop_name {
      width: 30%;
    }

    .clusterpop_upper_progress {
      width: 70%;
      margin-left: 5px;
    }


  }

  .clusterpop_lower {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 10px;
    margin-bottom: 20px;


    .avatar-card {
      width: 1200px;
      height: 500px;
      padding: 20px;
      border: 1px solid var(--el-border-color);
      border-radius: 10px;
    }

    .avatar-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }

    .avatar-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      cursor: pointer;
    }

    .admin-avatar {
      border: 2px solid red;
    }


  }
}

.simple_text_red {
  margin: 5px;
  padding: 25px;
  font-size: 15px;
  font-weight: bold;
  color: #ee0b1a;
}


.clusterpop_close-button {
  display: flex;
  width: 15%;
  justify-content: center;
  margin-left: 30%;
  margin-top: 20px;
}

.avatar-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.avatar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
}

.admin-avatar {
  border: 2px solid red;
}

.clusterpop_op-buttons {
  width: 10% !important;
}

</style>

