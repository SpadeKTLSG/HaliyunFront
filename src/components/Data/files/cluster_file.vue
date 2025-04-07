<template>

  <!--主体-->
  <div class="clusterfile">

    <!-- 上部区域-->
    <div class="clusterfile_upper">


      <!-- 搜索输入下拉框 -->
      <el-select v-model="selectedGroupId"
                 filterable
                 remote
                 :remote-method="searchGroups"
                 @keyup.enter="searchGroups"
                 placeholder="选择群组"
                 class="clusterfile_selector"
      >

        <el-option v-for="item in groupOptions"
                   :key="item.id"
                   :label="item.name"
                   :value="item.id">
        </el-option>

      </el-select>


      <!-- 群名称显示 -->
      <span class="clusterfile_name">
        <el-text type="primary" class="simple_text_red">
          群组名称:
        {{ (selectedGroup.name !== "") ? selectedGroup.name : "请在左侧选择" }}
        </el-text>
      </span>


      <!-- 操作按钮 -->
      <el-button type="primary" @click="uploadMainFunc()">上传文件</el-button>
      <el-button type="primary" @click="downloadMainFunc()">下载文件</el-button>

    </div>


    <el-divider></el-divider>

    <!-- 下部区域 -->
    <div class="clusterfile_lower">


    </div>


    <!--弹框区域-->

    <!-- 文件详细信息弹框 -->
    <el-dialog
        v-model="fileDetailDialogVisible"
        title="用户详情">

      <!-- 文件基础信息展示 -->
      <el-descriptions :column="2" border size="small">
        <el-descriptions-item label="文件名">{{ selectedFile.name }}</el-descriptions-item>
        <!--todo-->
      </el-descriptions>

      <!-- 操作按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="fileDetailDialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>


    <!-- 删除文件确认对话框 -->
    <el-dialog
        v-model="kickoutDialogVisible"
        title="删除文件"
    >

      <p> 确认删除 {{ selectedFile.name }} ? 未来会采用回收站 </p>

      <span slot="footer" class="dialog-footer">
        <el-button @click="kickoutDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="doDelFile()">确认</el-button>
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

//? 下部 头像矩阵排列

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
        clusterId: BigInt(selectedGroupId.value),
        userId: BigInt(memberId)
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


.clusterfile {

  .clusterfile_upper {
    display: flex;
    align-items: center;
    margin-top: -30px;
    margin-bottom: 5px;

    .clusterfile_selector {
      width: 20%;
      margin-right: 10px;
      margin-left: 20px;
    }

    .clusterfile_name {
      width: 30%;
    }

    .clusterfile_upper_progress {
      width: 70%;
      margin-left: 5px;
    }


  }

  .clusterfile_lower {
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
  font-size: 15px;
  font-weight: bold;
  color: #ee0b1a;
}


</style>

