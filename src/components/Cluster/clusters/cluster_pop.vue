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
                 placeholder="选择群组"
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

      <!-- 群容量 -->
      <span class="clusterpop_name">
        <el-text type="primary" class="simple_text_red">
          群组容量: {{ selectedGroup.popVolume }}
        </el-text>
      </span>

    </div>


    <el-divider></el-divider>

    <!-- 下部区域: 群组人员展示 (这个页面之后在管理群的时候会被经常复用简单模式) -->
    <div class="clusterpop_lower">

      <!-- 头像矩阵排列 -->

      <el-card class="avatar-card" shadow="hover">

        <!-- 头像矩阵排列对象 -->
        <div class="avatar-grid">

          <div v-for="member in usersData"
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


    <!-- 用户信息弹框 -->
    <el-dialog
        v-model="memberDialogVisible"
        title="用户详情">
      <!-- 用户信息展示 -->
      <el-descriptions :column="2" border size="small">
        <el-descriptions-item label="账号">{{ selectedMember.account }}</el-descriptions-item>
      </el-descriptions>
      <!-- 操作按钮 -->
      <el-button type="danger" @click="showKickoutDialog()">将其踢出群聊</el-button>
    </el-dialog>


    <!-- 踢出群组确认对话框 -->
    <el-dialog
        v-model="kickoutDialogVisible"
        title="放逐!"
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
const groupOptions = ref([]); // 群组列表


// 选中的群组数据 (id查)
const selectedGroup = ref({
  id: '',
  creatorUserId: '',
  name: '',
  popVolume: 0
});
const selectedGroupId = ref(null); // 选中的群组id


onMounted(
    //初始需要先获取用户加入的群组列表
    () => {
      searchGroups();
    }
);

// 查询用户加入的群组列表
const searchGroups = async () => {
  try {

    await http({
      url: http.adornUrl('Cluster/clusters/clusterEzOfMe'),
      method: 'get'
    }).then(({data}) => {
      // 数据处理和后端对齐

      //? 后端 清单 Array => 前端 ref([]) 的传递方法
      groupOptions.value = data.map(group => ({
        id: group.id,
        name: group.name,
        popVolume: group.popVolume
      }));
    });

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
  id: '',

}); // 选中的成员信息存储

// 人员信息分页数据展示表单
const usersData = ref([]); // 群组成员信息列表


// 选择了对应的群组, 通过群组 id 进行人员信息查询

watch(selectedGroupId, async (newVal) => {
  if (newVal) {
    selectedGroup.value = groupOptions.value.find(group => group.id === newVal);
    await fetchMembers(newVal);
  }
});


// 查询群组成员信息, 偷懒直接不分页了
const fetchMembers = async (clusterId) => {
  try {
    await http({
      url: http.adornUrl('Guest/users/cluster/user_list'),
      method: 'get',
      params: {
        clusterId: clusterId
      }
    }).then(({data}) => {
      // 数据处理和后端对齐
      //? 后端 清单 Array => 前端 ref([]) 的传递方法
      usersData.value = data.map(member => ({
        id: member.id,
        account: member.account
      }));
    });

  } catch (error) {
    ElMessage({
      message: '获取群组成员失败: ' + error.message,
      type: 'error',
      duration: 1000
    });
  }
};

//? 人员具体信息查询

const memberDialogVisible = ref(false);

// 显示成员详情对话框
const viewMemberDetails = (member) => {
  selectedMember.value = member;
  memberDialogVisible.value = true;
};


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
      url: http.adornUrl('Cluster/clusters/kick_cluster'),
      method: 'delete',
      params: {
        clusterId: selectedGroupId.value,
        userId: memberId
      }
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

