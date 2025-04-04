<template>

  <!--主体-->
  <div class="clusterhall">

    <!-- 上部区域: 操作按钮集合-->
    <div class="clusterhall_upper">
      <el-col :span="10">

        <!--刷新-获取数据-->
        <el-button @click="searchClusterCollect()" class="clusterhall_op-buttons">刷新</el-button>

      </el-col>
    </div>


    <el-divider></el-divider>

    <!-- 下部区域: 群组展示-->
    <div class="clusterhall_lower">

      <el-table :data="pageData.records" style="width: 90%">
        <el-table-column prop="pic" label="封面"></el-table-column>
        <el-table-column prop="name" label="群组名称"></el-table-column>
        <el-table-column prop="nickname" label="群组别名"></el-table-column>
        <el-table-column prop="popVolume" label="容量"></el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <el-table-column prop="updateTime" label="更新时间"></el-table-column>


        <el-table-column label="操作">
          <template #default="scope">
            <el-button @click="viewDetails(scope.row)"
                       type="primary"
                       style="width: 40px"
            >
              详情
            </el-button>
            <el-button @click="joinGroup(scope.row)"
                       type="success"
                       style="width: 40px"
            >
              加入
            </el-button>
          </template>
        </el-table-column>

      </el-table>

      <!--之后统一用这种双向绑定的-->
      <el-pagination
          layout="total, prev, pager, next"
          v-model:current-page="pageData.current"
          :page-size="pageData.size"
          :total="pageData.total"
          style="margin-top: 20px;"
      />
    </div>

    <!-- 详情信息对话框 (查全部群组信息)  -->
    <el-dialog
        v-model="detailsDialogVisible"
        title="群组详情"
    >

      <div>
        <img alt="Image" src="@/../static/img/ClusterShowPic.png" style="width:10%; height: auto; padding-left: 80px">
      </div>

      <el-text class="simple_text_red">群组基础信息</el-text>

      <el-descriptions :column="2" border size="small">
        <el-descriptions-item label="群组名称">{{ selectedGroup.name }}</el-descriptions-item>
        <el-descriptions-item label="群组昵称">{{ selectedGroup.nickname }}</el-descriptions-item>
        <el-descriptions-item label="容量">{{ selectedGroup.popVolume }}</el-descriptions-item>
        <el-descriptions-item label="使用空间大小">{{ selectedGroup.usedSpace }}</el-descriptions-item>
        <el-descriptions-item label="总空间大小">{{ selectedGroup.totalSpace }}</el-descriptions-item>
        <el-descriptions-item label="创建人账号">{{ selectedGroup.userAccount }}</el-descriptions-item>
        <el-descriptions-item label="管理创建">{{ (selectedGroup.userIsAdmin) === 0 ? '是' : '否' }}</el-descriptions-item>
        <el-descriptions-item label="允许加入">{{ (selectedGroup.allowInvite) === 0 ? '是' : '否' }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ selectedGroup.createTime }}</el-descriptions-item>
        <el-descriptions-item label="修改时间">{{ selectedGroup.updateTime }}</el-descriptions-item>
      </el-descriptions>


      <el-text class="simple_text_red">相册</el-text>
      <div>
        <img alt="Image" src="@/../static/img/ClusterShowPic.png" style="width:10%; height: auto; padding-left: 80px">
        <img alt="Image" src="@/../static/img/ClusterShowPic.png" style="width:10%; height: auto; padding-left: 80px">
        <img alt="Image" src="@/../static/img/ClusterShowPic.png" style="width:10%; height: auto; padding-left: 80px">
        <img alt="Image" src="@/../static/img/ClusterShowPic.png" style="width:10%; height: auto; padding-left: 80px">
      </div>


      <el-text class="simple_text_red">公告</el-text>
      <el-descriptions :column="1" border size="small">
        <el-descriptions-item label="公告名称">{{ selectedGroup.noticeName }}</el-descriptions-item>
        <el-descriptions-item label="公告内容">{{ selectedGroup.noticeContent }}</el-descriptions-item>
      </el-descriptions>


      <el-text class="simple_text_red">货币情况</el-text>
      <div>
        <img alt="Image" src="@/../static/img/CurrencyShowPic.png" style="width:10%; height: auto; padding-left: 80px">
      </div>
      <el-descriptions :column="2" border size="small">
        <el-descriptions-item label="货币名称">{{ selectedGroup.currencyName }}</el-descriptions-item>
        <el-descriptions-item label="货币储量">{{ selectedGroup.currencyStock }}</el-descriptions-item>
        <el-descriptions-item label="货币硬币转化率">{{ selectedGroup.currencyExchangeRate }}</el-descriptions-item>
        <el-descriptions-item label="硬币储量">{{ selectedGroup.coinStock }}</el-descriptions-item>
      </el-descriptions>

      <el-text class="simple_text_red">群组评论</el-text>
      <el-descriptions :column="2" border size="small">
        <el-descriptions-item label="大热评">{{ selectedGroup.content[0] }}</el-descriptions-item>
        <el-descriptions-item label="热评">{{ selectedGroup.content[1] }}</el-descriptions-item>
        <el-descriptions-item label="评">{{ selectedGroup.content[2] }}</el-descriptions-item>
      </el-descriptions>

      <span slot="footer" class="dialog-footer">
        <el-button @click="detailsDialogVisible = false"
                   class="clusterhall_close-button"
        >关闭</el-button>
      </span>

    </el-dialog>

    <!-- 加入群组对话框 -->
    <el-dialog
        v-model="joinDialogVisible"
        title="加入群组"
    >

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


// 选中的群组 (id查)
const selectedGroup = ref({

  // Cluster
  id: 0n,
  name: '',
  nickname: '',
  pic: '',
  popVolume: 0,


  // ClusterDetail
  shareLink: '',
  album: '',
  usedSpace: 0n,
  totalSpace: 0n,
  createTime: '',
  updateTime: '',


  // ClusterFunc
  allowInvite: 0,
  currencyStock: 0n,
  coinStock: 0n,


  // Creator
  userAccount: '',
  userIsAdmin: 0,


  // Notice
  noticeName: '',
  noticeContent: '',


  //Currency
  currencyName: '',
  currencyExchangeRate: '',
  currencyPic: '',

  //Remarks
  content: [],

});

// 对话框可见性
const detailsDialogVisible = ref(false);
const joinDialogVisible = ref(false);


// 查看详情
const viewDetails = (group) => {
  getOneCluster(group.id);
  detailsDialogVisible.value = true;
};

// 加入群组
const joinGroup = (group) => {
  Object.assign(selectedGroup, group);
  joinDialogVisible.value = true;
};


//! 查


onMounted(async () => {
  await getAllClusterPage(pageData.current, pageData.size);
});


// 查询按钮点击事件
const searchClusterCollect = () => {
  getAllClusterPage(pageData.current, pageData.size);
};


/**
 * 分页获取群组数据
 */
const getAllClusterPage = async (current, size) => {
  try {
    const {data} = await http({
      url: http.adornUrl('Cluster/clusters/hall/all'),
      method: 'get',
      params: {
        current,
        size
      }
    });
    pageData.current = data.current;
    pageData.size = data.size;
    pageData.total = data.total;
    pageData.records = data.records.map(record => {
      return {
        ...record,
        id: BigInt(record.id) // 将 id 转换为 BigInt 类型
      };
    });


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


/**
 * id查单个群组详情
 */
const getOneCluster = (id) => {
  http({
    url: http.adornUrl('Cluster/clusters/hall/one'),
    method: 'get',
    params: {
      id
      //id: id.toString() // 将 BigInt 转换为字符串传递给后端
    }
  }).then(({data}) => {
    selectedGroup.value = data
  }).catch((error) => {
    ElMessage({
      message: '获取群组详情失败: ' + error.message,
      type: 'error',
      duration: 1000
    });
  });
}


// 确认加入群组
const confirmJoinGroup = async (clusterId) => {
  try {
    await http({
      url: http.adornUrl('Cluster/clusters//hall/join'),
      method: 'post',
      params: {
        clusterId: selectedGroup.id
      }
    });
    ElMessage({
      message: '加入群组成功',
      type: 'success',
      duration: 1000
    });
    joinDialogVisible.value = false;
    await getAllClusterPage();
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

    margin-top: -100px;
    margin-bottom: 5px;


    .clusterhall_op-buttons {
      width: 10% !important;
    }

  }

  .clusterhall_lower {
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
  font-size: 20px;
  font-weight: bold;
  color: #ee0b1a;
}


.clusterhall_close-button {
  display: flex;
  width: 15%;
  justify-content: center;
  margin-left: 30%;
  margin-top: 20px;
}
</style>
