<template>

  <!--主体-->
  <div class="notice_manage">

    <!-- 上部区域: 引导集合 + 发布公告 / 修改公告 / 删除公告 -->
    <div class="notice_manage_upper">


      <!-- 搜索输入下拉框 -->
      <el-select v-model="selectedGroupId"
                 filterable
                 remote
                 :remote-method="searchGroups"
                 @keyup.enter="searchGroups"
                 placeholder="选择群组"
                 class="notice_manage_selector"
      >

        <el-option v-for="item in groupOptions"
                   :key="item.id"
                   :label="item.name"
                   :value="item.id">
        </el-option>

      </el-select>


      <!-- 群名称显示 -->
      <span class="notice_manage_name">
        <el-text type="primary" class="simple_text_red">
          群组名称:
        {{ (selectedGroup.name !== "") ? selectedGroup.name : "请在左侧选择" }}
        </el-text>
      </span>

      <!-- 操作按钮 -->


    </div>


    <el-divider></el-divider>

    <!-- 下部区域: 当前群组信息-->
    <div class="notice_manage_lower">

      <!--当前公告信息展示-->
      <el-text class="simple_text_red">
        当前公告信息:
      </el-text>

      <el-text class="simple_text_red">
        公告标题:
        <div>
          <el-text class="simple_text_red">
            {{ (selectedGroup.name !== "") ? selectedGroup.name : "请在左侧选择" }}
          </el-text>
        </div>
      </el-text>

      <el-text class="simple_text_red">
        公告内容:
      </el-text>

      <el-text class="simple_text_red">
        阅读数:
      </el-text>


    </div>


    <!-- 公告新增弹框 -->
    <el-dialog
        v-model="addDialogVisible"
        title="新增群组公告">

      <!--公告信息输入框-->


      <!-- 操作按钮 -->
      <el-button type="danger" @click="addNotice()">新增</el-button>
    </el-dialog>


    <!-- 公告修改弹框 -->
    <el-dialog
        v-model="updateDialogVisible"
        title="更新群组公告">

      <!--公告信息输入框, 回显对应原有数据-->


      <!-- 操作按钮 -->
      <el-button type="danger" @click="addNotice()">新增</el-button>
    </el-dialog>


    <!-- 删除公告确认对话框 -->
    <el-dialog
        v-model="delDialogVisible"
        title="删除群组公告"
    >

      <p> 确认删除该公告 ?</p>

      <span slot="footer" class="dialog-footer">
        <el-button @click="delDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="delNotice()">确认</el-button>
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
  id: 0n,
  creatorUserId: 0n,
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
        id: BigInt(group.id),
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


//? 下部 公告信息排列

const selectedMember = ref({
  id: 0n,

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
        clusterId: BigInt(clusterId)
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

const addDialogVisible = ref(false);

// 显示成员详情对话框
const viewMemberDetails = (member) => {
  selectedMember.value = member;
  addDialogVisible.value = true;
};


//? 踢出人员操作

const delDialogVisible = ref(false);

// 显示踢出对话框
const showKickoutDialog = () => {
  // 由于已经打开了成员详情对话框, 直接继续打开即可, 使用已经选择的对象信息
  delDialogVisible.value = true;
};


// 确认踢出操作
const confirmKickout = () => {
  kickOutMember(selectedMember.value.id);
  delDialogVisible.value = false;
};

// 踢出成员
const kickOutMember = (memberId) => {
  try {
    http({
      url: http.adornUrl('Cluster/clusters/kick_cluster'),
      method: 'delete',
      params: {
        clusterId: BigInt(selectedGroupId.value),
        userId: BigInt(memberId)
      }
    });

    addDialogVisible.value = false;
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

.notice_manage {

  .notice_manage_upper {
    display: flex;
    align-items: center;
    margin-top: -30px;
    margin-bottom: 5px;

    .notice_manage_selector {
      width: 20%;
      margin-right: 10px;
      margin-left: 20px;
    }

    .notice_manage_name {
      width: 30%;
    }

    .notice_manage_upper_progress {
      width: 70%;
      margin-left: 5px;
    }


  }

  .notice_manage_lower {
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


.notice_manage_close-button {
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

.notice_manage_op-buttons {
  width: 10% !important;
}

</style>

