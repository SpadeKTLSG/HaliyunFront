<template>

  <!--主体-->
  <div class="usercollect_file">

    <!-- 上部区域: 单独文件收藏的操作工作区域 -->
    <div class="usercollect_file_upper">

      <div class="usercollect_file_control_panel">
        <!--查询按钮-->
        <el-col :span="8">

          <el-button
              type="primary"
              icon="el-icon-search"
              @click="searchFileCollect"
          >查询
          </el-button>


        </el-col>
      </div>

    </div>


    <el-divider></el-divider>

    <!-- 下部区域: 具体文件收藏分页查询列表项-->
    <div class="usercollect_file_lower">
      <!--分页查询的展示框, 提供回车查询绑定, 以及指定查询参数功能-->

      <!--右侧单条折叠操作: 删除-->
      <el-table :data="pageData.records" style="width: 90%">
        <el-table-column prop="name" label="文件名"></el-table-column>
        <el-table-column prop="clusterName" label="来自群组"></el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <el-table-column prop="updateTime" label="更新时间"></el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button
                type="danger"
                icon="el-icon-delete"
                @click="deleteFileCollect(scope.row)"
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


//? 用户数据展示表单 (对应子页签分区数据) 复用
// const pageData = ref({});

// 用户数据展示表单 (对应子页签分区数据) 复用
const pageData = reactive({
  current: 1,
  size: 10,
  total: 0,
  records: []
});

//! 查
onMounted(async () => {
  // 先拉取用户收藏的信息
  await getUserDataOfFile(pageData.current, pageData.size);

});

// 查询按钮点击事件
const searchFileCollect = () => {
  getUserDataOfFile(pageData.current, pageData.size);
};

// 分页组件页码改变事件
const handleCurrentChange = (newPage) => {
  pageData.current = newPage;
  getUserDataOfFile(newPage, pageData.size);
};


// 获取用户收藏的文件数据
const getUserDataOfFile = async (current, size) => {
  try {
    const {data} = await http({
      url: http.adornUrl('Guest/datas/collect/data/file'),
      method: 'get',
      params: {
        current,
        size
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
      //如果没有数据, 先填充示例假数据
      pageData.records = [
        {
          id: 1,
          name: '示例文件对象: 在对应文件处点击收藏后回来查看',
          clusterName: '来自示例群组'
        },
        {
          id: 2,
          name: '示例文件对象2',
          clusterName: '来自示例群组2 (没啥用) '
        },
      ];

      pageData.total = 2;
    }

  } catch (error) {
    ElMessage({
      message: '获取用户数据失败: ' + error.message,
      type: 'error',
      duration: 1000
    });
  }


};


// 删除文件收藏 todo 后端做好了再来改
const deleteFileCollect = (row) => {
  http({
    url: http.adornUrl(`Guest/datas/collect/data/file/delete/${row.id}`),
    method: 'delete'
  }).then(() => {
    ElMessage({
      message: '删除成功',
      type: 'success',
      duration: 1000
    });
    searchFileCollect();
  }).catch((error) => {
    ElMessage({
      message: '删除失败: ' + error.message,
      type: 'error',
      duration: 1000
    });
  });
};

</script>


<style lang="scss" scoped>

.usercollect_file {

  .usercollect_file_upper {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: -200px;
    margin-bottom: 20px;


    .usercollect_file_control_panel {
      width: 100%;
      display: flex;
    }
  }


  .usercollect_file_lower {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 10px;
    margin-bottom: 20px;
  }


}


.simple_text_red {
  padding: 5px;
  font-size: 20px;
  font-weight: bold;
  color: #ee0b1a;
}

</style>
