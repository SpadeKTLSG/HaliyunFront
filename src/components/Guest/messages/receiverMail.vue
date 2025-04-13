<template>


  <!--主体-->
  <div class="user_mes_app">

    <!-- 上部区域: 操作按钮-->
    <div class="user_mes_app_upper">

      <!--刷新-->
      <el-button
          type="primary"
          class="refresh_button"
          @click="listMyMes0()"
      >
        刷新
      </el-button>


    </div>


    <el-divider></el-divider>

    <!-- 下部区域: 收件箱信件对象展示-->
    <div class="user_mes_app_lower">

      <el-table :data="receiverMailData" style="width: 90%">

        <el-table-column prop="pic" label="封面"></el-table-column>
        <!--        <el-table-column prop="name" label="群组名称"></el-table-column>-->
        <!--        <el-table-column prop="nickname" label="群组别名"></el-table-column>-->
        <!--        <el-table-column prop="popVolume" label="容量"></el-table-column>-->
        <!--        <el-table-column prop="createTime" label="创建时间"></el-table-column>-->
        <!--        <el-table-column prop="updateTime" label="更新时间"></el-table-column>-->


        <el-table-column label="操作">
          <template #default="scope">
            <el-button @click="viewDetail(scope.row)"
                       type="primary"
                       style="width: 40px"
            >
              详情
            </el-button>
            <el-button @click="deleteMail(scope.row)"
                       type="success"
                       style="width: 40px"
            >
              焚毁
            </el-button>
          </template>
        </el-table-column>

      </el-table>

    </div>


  </div>

  <!--弹框区域-->

  <!--信件详情弹框 (就是阅读嵌入式业务) -->
  <el-dialog
      v-model="detailsDialogVisible"
      title="信件详情"
  >

    <el-text class="simple_text_red">信件详细信息</el-text>

    <el-descriptions :column="2" border size="small">
      <el-descriptions-item label="群组名称">{{ selectedGroup.name }}</el-descriptions-item>
      <!--      <el-descriptions-item label="群组昵称">{{ selectedGroup.nickname }}</el-descriptions-item>-->
      <!--      <el-descriptions-item label="容量">{{ selectedGroup.popVolume }}</el-descriptions-item>-->
      <!--      <el-descriptions-item label="使用空间大小">{{ selectedGroup.usedSpace }}</el-descriptions-item>-->
      <!--      <el-descriptions-item label="总空间大小">{{ selectedGroup.totalSpace }}</el-descriptions-item>-->
      <!--      <el-descriptions-item label="创建人账号">{{ selectedGroup.userAccount }}</el-descriptions-item>-->
      <!--      <el-descriptions-item label="管理创建">{{ (selectedGroup.userIsAdmin) === 0 ? '是' : '否' }}</el-descriptions-item>-->
      <!--      <el-descriptions-item label="允许加入">{{ (selectedGroup.allowInvite) === 0 ? '是' : '否' }}</el-descriptions-item>-->
      <!--      <el-descriptions-item label="创建时间">{{ selectedGroup.createTime }}</el-descriptions-item>-->
      <!--      <el-descriptions-item label="修改时间">{{ selectedGroup.updateTime }}</el-descriptions-item>-->
    </el-descriptions>


    <span slot="footer" class="dialog-footer">
        <el-button @click="detailsDialogVisible = false"
                   class="user_mes_app_close-button"
        >关闭</el-button>
    </span>

  </el-dialog>

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


// ! Refresh
onMounted(() => {
  listMyMes0();
});

// ! List

const receiverMailData = ref([]); // 收件箱数据

const listMyMes0 = async () => {
  http({
    // 查询详情的接口复用的, 这里需要手动处理一下传递的Map过程
    url: http.adornUrl('Guest/messages/list'),
    method: 'get',
    params: {
      orderType: 0, // 对应后端实现收件箱发件箱判别
    }
  }).then(({data}) => {
    //? 后端 清单 Array => 前端 ref([]) 的传递方法

    receiverMailData.value = data.map(mail => ({
      id: BigInt(mail.id),
      clusterId: BigInt(mail.clusterId),
      senderId: BigInt(mail.senderId),
      receiverId: BigInt(mail.receiverId),

      // 状态
      status: mail.status,
      droped: mail.droped,

      // 展示标题
      header: mail.header,
    }));

  }).catch((error) => {
    ElMessage({
      message: '获取用户信件失败: ' + error.message,
      type: 'error',
      duration: 1000
    });
  });
};


// ! Delete

// ! Detail
const detailsDialogVisible = ref(false); // 详情弹框

</script>

<style lang="scss" scoped>

.user_mes_app {

  .user_mes_app_upper {
    display: flex;
    flex-direction: column;

    margin-top: -80px;
    margin-bottom: 5px;


    .refresh_button {
      width: 30px;
    }

  }

  .user_mes_app_lower {
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


.user_mes_app_close-button {
  display: flex;
  width: 15%;
  justify-content: center;
  margin-left: 30%;
  margin-top: 20px;
}

</style>
