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
      <el-table :data="pageData.records" style="width: 100%">
        <el-table-column prop="name" label="文件名"></el-table-column>
        <el-table-column prop="groupName" label="来自群组"></el-table-column>
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
          @current-change="handleCurrentChange"
          :current-page="pageData.current"
          :page-size="pageData.size"
          layout="total, prev, pager, next"
          :total="pageData.total">
      </el-pagination>
    </div>


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
// const pageData = ref({});

// 用户数据展示表单 (对应子页签分区数据) 复用
const pageData = reactive({
  current: 1,
  size: 10,
  total: 0,
  records: []
});

//Result<PageResponse<PostVO>>

//    /**
// * 当前页
// */
// private Long current;
//
// /**
//  * 每页显示条数
//  */
// private Long size;
//
// /**
//  * 总数
//  */
// private Long total;
//
// /**
//  * 查询数据列表
//  */
// private List<T> records;

//! 查

onMounted(() => {
  // 先拉取用户收藏的信息
  getUserDataOfFile(pageData.current, pageData.size);
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
const getUserDataOfFile = (current, size) => {
  http({
    url: http.adornUrl('Guest/datas/collect/data/post'),
    method: 'get',
    params: UserContext.getUserId(),
    data: http.adornParamsPageBody({}, current, size)
  }).then(({data}) => {
    // 处理分页响应数据并展示到页面 : Result<PageResponse<PostVO>>
    pageData.current = data.current;
    pageData.size = data.size;
    pageData.total = data.total;
    pageData.records = data.records;
  }).catch((error) => {
    ElMessage({
      message: '获取用户数据失败: ' + error.message,
      type: 'error',
      duration: 1000
    });
  });
};


// 删除文件收藏 todo 后端做好了再来改
const deleteFileCollect = (row) => {
  http({
    url: http.adornUrl(`Guest/datas/collect/data/delete/${row.id}`),
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
