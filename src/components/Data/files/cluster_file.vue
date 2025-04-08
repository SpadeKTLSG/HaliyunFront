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


      <!-- 特写的上传按钮 - EL 实现 -->
      <el-upload
          ref="upload"
          class="upload-demo"
          action="http://localhost:10000/Data/tasks/upload/file"
          :limit="1"
          :on-exceed="handleExceed"
          :auto-upload="false"
          :before-upload="beforeUpload"
          :data="uploadExtraData"
          v-model:file-list="fileList"
      >

        <el-button type="success" class="ml-3" @click="submitUpload">上传文件</el-button>

        <template #tip>
          <div class="simple_text_red">
            上传1个<500 MB 文件
          </div>
        </template>

        <template #trigger>
          <el-button type="primary" class="clusterfile_upbotton">选择文件</el-button>
        </template>

      </el-upload>

    </div>


    <el-divider></el-divider>

    <!-- 下部区域 -->
    <div class="clusterfile_lower">

      <!--对应群组的分页文件表格展示-->
      <el-table :data="pageData.records" style="width: 90%">

        <el-table-column prop="name" label="文件名"></el-table-column>
        <!-- todo 填充列-->
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <el-table-column prop="updateTime" label="更新时间"></el-table-column>


        <el-table-column label="操作">

          <template #default="scope">

            <el-button
                type="info"
                icon="el-icon-edit"
                @click="detailMainFunc(scope.row)"
            >详情
            </el-button>

            <el-button
                type="warning"
                icon="el-icon-download"
                @click="downloadMainFunc(scope.row)"
            >下载
            </el-button>

            <el-button
                type="danger"
                icon="el-icon-delete"
                @click="deleteMainFunc(scope.row)"
            >删除
            </el-button>


          </template>


        </el-table-column>
      </el-table>

      <el-pagination
          layout="total, prev, pager, next"
          @current-change="handleCurrentChange"
          :current-page="pageData.current"
          :page-size="pageData.size"
          :total="pageData.total"
          type="primary"
          style="margin-top: 20px;"
      >
      </el-pagination>


    </div>


    <!--弹框区域-->

    <!-- 文件详细信息弹框 -->
    <el-dialog
        v-model="fileDetailDialogVisible"
        title="用户详情">

      <!-- 文件基础信息展示 -->
      <el-descriptions :column="2" border size="small">
        <el-descriptions-item label="文件名">{{ selectedFileInfo.value.name }}</el-descriptions-item>
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

      <p> 确认删除 {{ selectedFileInfo.value.name }} ? 未来会采用回收站 </p>

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


//? 上部 搜索输入下拉框

// 复用...


const groupOptions = ref([]); // 群组列表

const selectedGroup = ref({
  id: 0n,
  creatorUserId: 0n,
  name: '',
  popVolume: 0
});
const selectedGroupId = ref(null); // 选中的群组id

onMounted(() => {
  searchGroups();
});


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
      duration: 3000
    });
  }
};


//? 下部 文件列表展示


// 分页表单
const pageData = reactive({
  current: 1,
  size: 10,
  total: 0,
  records: []
});


// 选择了对应的群组, 通过群组 id 进行文件信息查询
watch(selectedGroupId, async (newVal) => {
  if (newVal) {
    selectedGroup.value = groupOptions.value.find(group => group.id === newVal);
    await fetchFile(newVal, pageData.current, pageData.size);
  }
});

// 分页组件页码改变事件
const handleCurrentChange = (newPage) => {
  pageData.current = newPage;
  fetchFile(selectedGroup.value.id, newPage, pageData.size);
};

// 分页查询群组的文件列表
const fetchFile = async (clusterId, current, size) => {
  try {
    await http({
      url: http.adornUrl('Data/files/file/group_files'),
      method: 'get',
      params: {
        clusterId: BigInt(clusterId),
        current,
        size
      }
    }).then(({data}) => {
      pageData.current = data.current;
      pageData.size = data.size;
      pageData.total = data.total;
      pageData.records = data.records.map(record => {
        return {
          ...record,
          id: BigInt(record.id) // 将 id 转换为 BigInt 类型
        };
      });
      // 数据处理和后端对齐
    });


    if (pageData.total === 0) {
      ElMessage({
        message: '暂无数据',
        type: 'warning',
        duration: 3000
      });
    }

  } catch (error) {
    ElMessage({
      message: '获取群组文件信息失败: ' + error.message,
      type: 'error',
      duration: 3000
    });
  }

};


//? 文件具体信息查询

const fileDetailDialogVisible = ref(false);


// 选中的文件信息存储
const selectedFileInfo = ref({
  id: 0n,
  //todo
  name: '',
  createTime: '',
  updateTime: ''
});

// 显示成员详情对话框
const detailMainFunc = (file) => {
  selectedFileInfo.value = file;
  fileDetailDialogVisible.value = true;
};


//? 删除文件操作
const kickoutDialogVisible = ref(false);

// 显示删除对话框
const deleteMainFunc = (file) => {
  selectedFileInfo.value = file;
  kickoutDialogVisible.value = true;
};


// 删除文件
const doDelFile = async () => {
  // 安全起见, 校验用户的删除权限放后端执行
  try {
    await http({
      url: http.adornUrl('Data/files/file/delete'),
      method: 'delete',
      params: {
        fileId: selectedFileInfo.value.id
      }
    });
    ElMessage({
      message: '删除文件成功',
      type: 'success',
      duration: 1000
    });
    kickoutDialogVisible.value = false;
    await fetchFile(selectedGroup.value.id, pageData.current, pageData.size);
  } catch (error) {
    ElMessage({
      message: '删除文件失败: ' + error.message,
      type: 'error',
      duration: 1000
    });
  }
};


//? 上传
// 适配 EL 上传组件


const upload = ref(null)
const fileList = ref([])


const maxSize = 500 * 1024 * 1024  // AKA 500MB

// 前置上传钩子
const beforeUpload = (file) => {
  if (file.size > maxSize) {
    ElMessage.error('上传文件大小不能超过 500MB')
    return false
  }
  return true
}

// 执行上传钩子
const handleExceed = (files) => {
  // 清空已有的文件列表后，再自动添加新选中的文件
  upload.value.clearFiles()
  const file = files[0]

  // 使用 Element Plus 内部方法开始上传（此处 uid 自动生成也可通过 genFileId 生成）
  upload.value.handleStart(file)
}


// 上传时需要额外传递的参数
const uploadExtraData = ref({
  clusterId: selectedGroupId.value || 0,
  pid: 0   // 默认父目录ID, 本来应该支持上传到指定目录位置. (先直接简单分页并排展示 成本问题不设计对应的树形结构处理工具)
  //?note 具体请参考个人笔记, 关于这里的废案实现
});


// 选中群组时同步更新 clusterId 参数
watch(selectedGroupId, (newVal) => {
  uploadExtraData.value.clusterId = newVal;
});


// 提交上传请求
const submitUpload = () => {
  upload.value.submit()
  // 不做提示了
}


//? 下载

//todo

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

