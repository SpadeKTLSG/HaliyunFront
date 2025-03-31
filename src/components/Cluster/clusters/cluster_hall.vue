<template>

  <!--主体-->
  <div class="clusterhall">

    <!-- 上部区域: 操作按钮集合-->
    <div class="clusterhall_upper">
      <el-col :span="10">

        <!--刷新-获取数据-->
        <el-button @click="getAllClusterPage()" class="userinfo_op-buttons">刷新</el-button>

        <!-- 行操作:  加入群组, 查看详细信息, 弹出表单即可-->
      </el-col>
    </div>


    <el-divider></el-divider>

    <!-- 下部区域: 群组展示-->
    <div class="clusterhall_lower">

      <el-table :data="pageData.records" style="width: 90%">
        <el-table-column prop="name" label="群组名称"></el-table-column>
        <el-table-column prop="description" label="群组描述"></el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <el-table-column prop="updateTime" label="更新时间"></el-table-column>


        <el-table-column label="操作">
          <template #default="scope">
            <el-button @click="viewDetails(scope.row)" type="primary">查看详情</el-button>
            <el-button @click="joinGroup(scope.row)" type="success">加入群组</el-button>
          </template>
        </el-table-column>

      </el-table>

      <el-pagination
          v-model:current-page="pageData.current"
          v-model:page-size="pageData.size"
          :total="pageData.total"
          layout="total, prev, pager, next"
          style="margin-top: 20px;"
      ></el-pagination>

    </div>

    <!-- 详情信息对话框 -->
    <el-dialog :visible.sync="detailsDialogVisible" title="群组详情">
      <el-descriptions :column="1" border>
        <el-descriptions-item label="群组名称">{{ selectedGroup.name }}</el-descriptions-item>
        <el-descriptions-item label="群组描述">{{ selectedGroup.description }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ selectedGroup.createTime }}</el-descriptions-item>
        <el-descriptions-item label="更新时间">{{ selectedGroup.updateTime }}</el-descriptions-item>
      </el-descriptions>
      <span slot="footer" class="dialog-footer">
        <el-button @click="detailsDialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>

    <!-- 加入群组对话框 -->
    <el-dialog :visible.sync="joinDialogVisible" title="加入群组">
      <p>确认加入群组: {{ selectedGroup.name }}?</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="joinDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmJoinGroup">确认</el-button>
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


// 群组分页数据展示表单
const pageData = reactive({
  current: 1,
  size: 10,
  total: 0,
  records: []
});


// 选中的群组
const selectedGroup = reactive({
  name: '',
  description: '',
  createTime: '',
  updateTime: ''
});

// 对话框可见性
const detailsDialogVisible = ref(false);
const joinDialogVisible = ref(false);


// 查看详情
const viewDetails = (group) => {
  Object.assign(selectedGroup, group);
  detailsDialogVisible.value = true;
};

// 加入群组
const joinGroup = (group) => {
  Object.assign(selectedGroup, group);
  joinDialogVisible.value = true;
};


//! 查


onMounted(() => {
  getAllClusterPage();
});


/**
 * 分页获取群组数据
 */

const getAllClusterPage = async () => {
  try {
    const {data} = await http({
      url: http.adornUrl('Cluster/clusters/hall/all'),
      method: 'get',
      params: {
        current: pageData.current,
        size: pageData.size
      }
    });
    pageData.current = data.current;
    pageData.size = data.size;
    pageData.total = data.total;
    pageData.records = data.records;


    if (pageData.total === 0) {
      ElMessage({
        message: '暂无数据',
        type: 'warning',
        duration: 1000
      });
    }

  } catch (error) {
    ElMessage({
      message: '获取群组大厅数据失败: ' + error.message,
      type: 'error',
      duration: 1000
    });
  }

};


// 分页组件页码改变事件
const handleCurrentChange = (newPage) => {
  pageData.current = newPage;
  getAllClusterPage();
};


// 确认加入群组
const confirmJoinGroup = async () => {
  try {
    await http({
      url: http.adornUrl(`Cluster/clusters/join/${selectedGroup.id}`),
      method: 'post'
    });
    ElMessage({
      message: '加入群组成功',
      type: 'success',
      duration: 1000
    });
    joinDialogVisible.value = false;
    getAllClusterPage();
  } catch (error) {
    ElMessage({
      message: '加入群组失败: ' + error.message,
      type: 'error',
      duration: 1000
    });
  }
}


</script>


<style lang="scss" scoped>

.clusterhall {

  .clusterhall_upper {
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
