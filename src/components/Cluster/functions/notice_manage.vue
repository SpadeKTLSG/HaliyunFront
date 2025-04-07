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
      <el-button type="primary" @click="showAddDialog">新增公告</el-button>
      <el-button type="primary" @click="showUpdateDialog">修改公告</el-button>
      <el-button type="danger" @click="showDeleteDialog">删除公告</el-button>


    </div>


    <el-divider></el-divider>

    <!-- 下部区域: 当前群组信息-->
    <div class="notice_manage_lower">

      <!--当前公告信息展示-->
      <el-text class="simple_text_red">
        当前公告信息:
      </el-text>

      <el-text class="simple_text_red">
        公告标题: {{ notice.name }}
      </el-text>

      <el-text class="simple_text_red">
        公告内容: {{ notice.content }}
      </el-text>

      <el-text class="simple_text_red">
        阅读数: {{ notice.readCount }}
      </el-text>


    </div>


    <!-- 公告新增弹框 -->
    <el-dialog
        v-model="addDialogVisible"
        title="新增群组公告">

      <el-form :model="newNotice">
        <el-form-item label="公告标题">
          <el-input v-model="newNotice.name"></el-input>
        </el-form-item>
        <el-form-item label="公告内容">
          <el-input type="textarea" v-model="newNotice.content"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="addNotice">新增</el-button>
      </span>

    </el-dialog>


    <!-- 公告修改弹框 -->
    <el-dialog
        v-model="updateDialogVisible"
        title="更新群组公告">

      <el-form :model="notice">
        <el-form-item label="公告标题">
          <el-input v-model="notice.name"></el-input>
        </el-form-item>
        <el-form-item label="公告内容">
          <el-input type="textarea" v-model="notice.content"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="updateDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="updateNotice">更新</el-button>
      </span>

    </el-dialog>


    <!-- 删除公告确认对话框 -->
    <el-dialog
        v-model="delDialogVisible"
        title="删除群组公告"
    >

      <p> 确认删除该公告 ?</p>

      <span slot="footer" class="dialog-footer">
        <el-button @click="delDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="deleteNotice()">确认</el-button>
      </span>

    </el-dialog>


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


//? 上部 搜索输入下拉框 + 按钮组件

// 群组信息
const groupOptions = ref([]);

// 选中的群组数据 (id查)
const selectedGroup = ref({
  id: 0n,
  creatorUserId: 0n, // 任何修改编辑都需要判断 UserHolder.getUI == creatorUserId (非创建人无法修改)
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


// 数据表单 * 2
const notice = ref({
  name: '',
  content: '',
  readCount: 0
});
const newNotice = ref({
  title: '',
  content: ''
});

// 监听用户选择群组变化
watch(selectedGroupId, async (newVal) => {
  if (newVal) {
    selectedGroup.value = groupOptions.value.find(group => group.id === newVal);
    await fetchNotice(newVal);
  }
});

// 获取对应公告信息
const fetchNotice = async (clusterId) => {
  try {
    const response = await http({
      url: http.adornUrl('Cluster/functions/notice'),
      method: 'get',
      params: {clusterId: BigInt(clusterId)}
    });

    if (response.data) {
      notice.value = response.data;
    }
  } catch (error) {
    ElMessage({
      message: '获取群组公告失败: ' + error.message,
      type: 'error',
      duration: 1000
    });
  }
};


//? 表单相关


// 展示控件按钮
const addDialogVisible = ref(false);
const updateDialogVisible = ref(false);
const delDialogVisible = ref(false);


const showAddDialog = () => {
  newNotice.value = {title: '', content: ''}; //  清空新增表单
  addDialogVisible.value = true;
};

const showUpdateDialog = () => {
  updateDialogVisible.value = true;
};

const showDeleteDialog = () => {
  delDialogVisible.value = true;
};

// 更新选择群组的信息
watch(selectedGroupId, async (newVal) => {
  if (newVal) {
    selectedGroup.value = groupOptions.value.find(group => group.id === newVal);
    await fetchNotice(newVal);
  }
});


// 鉴权操作处理
const checkIsMaster = () => {
  console.log('群组创建者: ' + selectedGroup.value.creatorUserId);
  console.log('当前用户: ' + UserContext.getUserId());

  if (UserContext.getUserId() !== selectedGroup.value.creatorUserId) {
    ElMessage({
      message: '操作: ' + '你不是群组的主人!',
      type: 'error',
      duration: 3000
    });
    return false;
  }
  return true;

}


// CRUD 方法
const addNotice = async () => {
  if (!checkIsMaster()) {
    return
  }

  try {
    await http({
      url: http.adornUrl(`Cluster/functions/notice/${selectedGroupId.value}`),
      method: 'post',
      data: newNotice.value
    });

    ElMessage({
      message: '新增公告成功',
      type: 'success',
      duration: 3000
    });

    addDialogVisible.value = false;
    await fetchNotice(selectedGroupId.value);

  } catch (error) {
    ElMessage({
      message: '新增公告失败: ' + error.message,
      type: 'error',
      duration: 3000
    });
  }
};


const updateNotice = async () => {
  if (!checkIsMaster()) {
    return
  }

  try {

    await http({
      url: http.adornUrl('Cluster/functions/notice'),
      method: 'put',
      data: notice.value
    });

    ElMessage({
      message: '更新公告成功',
      type: 'success',
      duration: 3000
    });

    updateDialogVisible.value = false;
    await fetchNotice(selectedGroupId.value);

  } catch (error) {
    ElMessage({
      message: '更新公告失败: ' + error.message,
      type: 'error',
      duration: 3000
    });
  }
};


const deleteNotice = async () => {
  if (!checkIsMaster()) {
    return
  }

  try {
    await http({
      url: http.adornUrl(`Cluster/functions/notice/${selectedGroupId.value}`),
      method: 'delete',
      params: {noticeId: notice.value.id}
    });
    ElMessage({
      message: '删除公告成功',
      type: 'success',
      duration: 3000
    });
    delDialogVisible.value = false;
    await fetchNotice(selectedGroupId.value);
  } catch (error) {
    ElMessage({
      message: '删除公告失败: ' + error.message,
      type: 'error',
      duration: 3000
    });
  }
};

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

