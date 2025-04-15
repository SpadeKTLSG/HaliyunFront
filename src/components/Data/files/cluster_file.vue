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

      <!--刷新页面数据按钮-->

      <el-button
          type="primary"
          class="refresh_button"
          @click="fetchFile(selectedGroup.id, pageData.current, pageData.size)"
      >
        刷新
      </el-button>


      <!--页面文件模糊查询-->
      <el-input
          v-model="searchQuery"
          :suffix-icon="Search"
          class="search-box"
          placeholder="随处搜索"
          @keyup.enter="fetchFileByName(selectedGroup.id, searchQuery, pageData.current, pageData.size)"
      >
        <el-icon slot="suffix" class="search-icon"></el-icon>
      </el-input>


      <!-- 特写的上传按钮 - EL 实现 -->
      <el-upload
          ref="upload"
          class="upload_compo"
          action="http://localhost:10000/Data/tasks/upload/file"
          :limit="1"
          :on-exceed="handleExceed"
          :auto-upload="false"
          :before-upload="beforeUpload"
          :data="uploadExtraData"
          v-model:file-list="fileList"
      >

        <el-button type="success" @click="submitUpload">上传文件</el-button>

        <template #tip>
          <div class="simple_text_red">
            上传1个<500 MB 文件
          </div>
        </template>

        <template #trigger>
          <el-button type="primary">选择文件</el-button>
        </template>

      </el-upload>

    </div>


    <el-divider></el-divider>

    <!-- 下部区域 -->
    <div class="clusterfile_lower">

      <!--对应群组的分页文件表格展示-->
      <el-table :data="pageData.records"
                style="width: 90%; max-height: 500px; overflow-y: auto;"
                :row-style="{ height: '20px' }">

        <el-table-column prop="name" label="文件名"></el-table-column>
        <el-table-column prop="type" label="文件类型">
          <template #default="scope">
            <el-tag>{{ scope.row.type }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="dscr" label="描述"></el-table-column>
        <el-table-column prop="downloadTime" label="下载次数"></el-table-column>
        <el-table-column prop="size" label="文件大小">
          <template #default="scope">
            <!-- 这里的文件大小单位是字节, 可以转换成 MB -->
            <el-tag>{{ scope.row.size }} B</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template #default="scope">
            <el-tag type="success" v-if="scope.row.status === 0">正常</el-tag>
            <el-tag type="warning" v-else-if="scope.row.status === 1">暂停</el-tag>
            <el-tag type="danger" v-else-if="scope.row.status === 2">冻结</el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="createTime" label="创建时间">
          <template #default="scope">
            <el-tag>{{ scope.row.createTime }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="更新时间">
          <template #default="scope">
            <el-tag>{{ scope.row.updateTime }}</el-tag>
          </template>
        </el-table-column>


        <el-table-column label="操作" class="clusterfile_lower_buttons">

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
        title="文件详情">

      <!-- 文件基础信息展示 -->
      <el-text type="primary" class="simple_text_red">
        文件基本信息
      </el-text>
      <el-descriptions :column="2" border size="small">

        <el-descriptions-item label="文件名">{{ selectedFileInfo.name }}</el-descriptions-item>
        <el-descriptions-item label="描述">{{ selectedFileInfo.dscr }}</el-descriptions-item>
        <el-descriptions-item label="文件大小">{{ selectedFileInfo.size }} B</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag type="success" v-if="selectedFileInfo.status === 0">正常</el-tag>
          <el-tag type="warning" v-else-if="selectedFileInfo.status === 1">暂停</el-tag>
          <el-tag type="danger" v-else-if="selectedFileInfo.status === 2">冻结</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ selectedFileInfo.createTime }}</el-descriptions-item>
        <el-descriptions-item label="更新时间">{{ selectedFileInfo.updateTime }}</el-descriptions-item>

      </el-descriptions>

      <!-- 文件详细信息展示 -->
      <el-text type="primary" class="simple_text_red">
        文件详细信息
      </el-text>


      <el-descriptions :column="2" border size="small">

        <el-descriptions-item label="文件类型">{{ selectedFileInfo.type }}</el-descriptions-item>
        <el-descriptions-item label="下载次数">{{ selectedFileInfo.downloadTime }}</el-descriptions-item>
        <el-descriptions-item label="文件路径">{{ selectedFileInfo.path }}</el-descriptions-item>
        <el-descriptions-item label="磁盘路径">{{ selectedFileInfo.diskPath }}</el-descriptions-item>
        <el-descriptions-item label="文件锁"> todo {{ selectedFileInfo.fileLock }}</el-descriptions-item>
        <el-descriptions-item label="标签"> todo {{ selectedFileInfo.tag }}</el-descriptions-item>


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

      <p> 确认删除 {{ selectedFileInfo.name }} ? 未来会采用回收站 </p>

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
import {UserContext} from "@/components/common/user.js";
import {Search} from "@element-plus/icons-vue";

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

  //? 由于涉及到请求后端的文件模块, 因此需要先发送一个请求进行 UserContext 的预热.

  searchGroups();
  hotData4Backend();
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


// 数据模块 UserContext 预热
const hotData4Backend = async () => {

  await http({
    url: http.adornUrl('Data/files/hotting'),
    method: 'post'
  })

}


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
    // 清空当前页面Page数据
    pageData.current = 1;
    pageData.size = 10;
    pageData.total = 0;
    pageData.records = [];

    // 选中群组变化
    selectedGroup.value = groupOptions.value.find(group => group.id === newVal);

    // 重新查询文件列表
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
          id: BigInt(record.id),
          pid: BigInt(record.pid),
          userId: BigInt(record.userId),
          clusterId: BigInt(record.clusterId),
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


// 对应的查询字段
const searchQuery = ref('');

// ! 分页查询群组的文件列表, 但是使用文件名作为搜索条件, 模糊最左匹配
const fetchFileByName = async (clusterId, fileName, current, size) => {
  try {
    await http({
      url: http.adornUrl('Data/files/file/group_files/name'),
      method: 'get',
      params: {
        clusterId: BigInt(clusterId),
        fileName: fileName,
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
          id: BigInt(record.id),
          pid: BigInt(record.pid),
          userId: BigInt(record.userId),
          clusterId: BigInt(record.clusterId),
        };
      });

      //? 采用了直接替换的兼容模式, 这个状态下不可分页 (后面再考虑提供)


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


// 选中的文件信息存储 (来自分页)
const selectedFileInfo = ref({
  id: 0n,

  userId: 0n,
  clusterId: 0n,
  name: '',
  type: '',

  dscr: '',
  downloadTime: 0,
  size: 0n,
  path: '',
  diskPath: '',

  tag: 0n,
  fileLock: 0n,
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
  userId: UserContext.getUserId(),
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

// 下载文件 (依赖浏览器的下载功能)
const downloadMainFunc = (file) => {
  const url = http.adornUrl('Data/tasks/download/file');
  const params = {
    id: file.id,
    userId: file.userId,
    clusterId: file.clusterId
  };

  // 拼接下载链接
  const downloadUrl = `${url}?${new URLSearchParams(params).toString()}`;

  // 使用隐藏 a 标签触发下载
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = file.name || 'downloaded_file';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

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

    .refresh_button {
      width: 30px;
      margin-left: -200px;
    }


    .search-box {
      width: 10%;
      height: 30px;
      margin-top: 20px;
      margin-left: 25px;

      .search-icon {
        cursor: pointer;
      }
    }

    .upload_compo {
      width: 30%;
      margin-left: 35px;
    }

  }


  .clusterfile_lower {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 10px;
    margin-bottom: 20px;

    .clusterfile_lower_buttons {
      // 并排按钮
      display: flex;
      flex-direction: row;
      justify-content: space-between;
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

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>

