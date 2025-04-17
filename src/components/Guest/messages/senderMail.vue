<template>


  <!--主体-->
  <div class="user_mes_app_sender">

    <!-- 上部区域: 操作按钮-->
    <div class="user_mes_app_sender_upper">


      <span>
        <!--刷新-->
        <el-button
            type="primary"
            class="refresh_button"
            @click="listMyMes1()"
        >
          刷新
        </el-button>

        <!--发信-->
        <el-button
            type="primary"
            class="refresh_button"
            @click="doSendMail()"
        >
          发信
        </el-button>
      </span>


    </div>


    <el-divider></el-divider>

    <!-- 下部区域: 发件箱信件对象展示-->
    <div class="user_mes_app_sender_lower">

      <el-table :data="senderMailData" style="width: 90%">

        <el-table-column prop="header" label="标题"></el-table-column>
        <el-table-column prop="receiverName" label="收件者"></el-table-column>
        <el-table-column prop="senderName" label="发件人"></el-table-column>
        <el-table-column prop="clusterName" label="来自群组"></el-table-column>
        <el-table-column prop="status" label="状态">
          <template #default="scope">
            <el-tag v-if="scope.row.status === 0" type="danger">创建未发送</el-tag>
            <el-tag v-else-if="scope.row.status === 1" type="danger">已发送未投递</el-tag>
          </template>
        </el-table-column>


        <el-table-column label="操作">
          <template #default="scope">
            <el-button @click="viewDetail(scope.row)"
                       type="primary"
                       style="width: 40px"
            >
              详情
            </el-button>
            <el-button @click="deleteMail(scope.row)"
                       type="danger"
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
      <el-descriptions-item label="标题">{{ selectedMail.header }}</el-descriptions-item>
      <el-descriptions-item label="发件人">{{ selectedMail.senderName }}</el-descriptions-item>
      <el-descriptions-item label="收件人">{{ selectedMail.receiverName }}</el-descriptions-item>
      <el-descriptions-item label="群组">{{ selectedMail.clusterName }}</el-descriptions-item>
      <el-descriptions-item label="状态">
        <el-tag v-if="selectedMail.status === 2" type="danger">已投递未查看</el-tag>
        <el-tag v-else-if="selectedMail.status === 3" type="primary">已查看</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="投递时间">{{ selectedMail.updateTime }}</el-descriptions-item>

    </el-descriptions>

    <el-text class="simple_text_red">信件正文</el-text>

    <el-card
        class="box-card"
        style="width: 100%; height: 300px; overflow-y: auto"
        :body-style="{ padding: '0px' }"
    >
      <div class="text item" style="padding: 14px">
        {{ selectedMail.body }}
      </div>
    </el-card>


    <span slot="footer" class="dialog-footer">
        <el-button @click="detailsDialogVisible = false"
                   class="user_mes_app_sender_close-button"
        >关闭</el-button>
    </span>

  </el-dialog>


  <!--发信弹框-->
  <el-dialog
      v-model="sendMailDialogVisible"
      title="发信"
      width="50%"
  >


    <el-form :model="sendMailData" label-width="150px">

      <el-form-item label="标题内容">
        <el-input v-model="sendMailData.header"></el-input>
      </el-form-item>

      <el-form-item label="正文内容">
        <el-input type="textarea" v-model="sendMailData.body">
        </el-input>
      </el-form-item>


      <el-form-item label="发信人id (默认自己) ">
        <el-input v-model="sendMailData.senderId"></el-input>
      </el-form-item>

      <el-form-item label="收信人id">
        <el-input v-model="sendMailData.receiverId"></el-input>
      </el-form-item>

      <el-form-item label="希望附加的群组id (可选)">
        <el-input v-model="sendMailData.clusterId"></el-input>
      </el-form-item>

    </el-form>

    <span slot="footer" class="dialog-footer">
        <el-button @click="sendMailDialogVisible = false"
                   class="user_mes_app_sender_close-button"
        >关闭
        </el-button>
        <el-button type="primary" @click="sendMailFunc">
          发信
        </el-button>
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


// ! SendMail

const sendMailDialogVisible = ref(false); // 发信弹框

const sendMailData = reactive({
  header: '',
  body: '',
  receiverId: 0,
  senderId: 0,
  clusterId: 0,
});

const doSendMail = () => {
  sendMailDialogVisible.value = true;
}

const sendMailFunc = () => {

  http({
    url: http.adornUrl('Guest/messages/send'),
    method: 'post',
    data: {
      header: sendMailData.header || '',
      body: sendMailData.body || '',
      senderId: sendMailData.senderId, // 后端默认处理
      receiverId: sendMailData.receiverId || null,
      clusterId: sendMailData.clusterId || null,
    }
  }).then(() => {

    sendMailDialogVisible.value = false;
    listMyMes1();

  }).catch((error) => {
    ElMessage({
      message: '发送失败: ' + error.message,
      type: 'error',
      duration: 10000
    });
  });
}

// ! Refresh
onMounted(() => {
  listMyMes1();
});

// ! List

const senderMailData = ref([]); // 发件箱数据

const listMyMes1 = async () => {
  http({
    // 查询详情的接口复用的, 这里需要手动处理一下传递的Map过程
    url: http.adornUrl('Guest/messages/list'),
    method: 'get',
    params: {
      orderType: 1,
    }
  }).then(({data}) => {
    //? 后端 清单 Array => 前端 ref([]) 的传递方法

    senderMailData.value = data.map(mail => ({
      id: mail.id,
      clusterId: mail.clusterId,
      senderId: mail.senderId,
      receiverId: mail.receiverId,

      // 状态
      status: mail.status,
      droped: mail.droped,

      // 展示标题
      header: mail.header,

      // 人员
      senderName: mail.senderName,
      receiverName: mail.receiverName,
      clusterName: mail.clusterName,

    }));

  }).catch((error) => {
    ElMessage({
      message: '获取用户信件失败: ' + error.message,
      type: 'error',
      duration: 1000
    });
  });
};


// ! Detail

const detailsDialogVisible = ref(false); // 详情弹框

// 选择的信件信息
const selectedMail = ref({

  id: '',

  clusterId: '',
  clusterName: '',

  senderId: '',
  senderName: '',

  receiverId: '',
  receiverName: '',

  status: '',
  droped: '',

  header: '',
  body: '',


});

const viewDetail = (mail) => {
  queryDetail4Mail0(mail.id)
  detailsDialogVisible.value = true;
}


const queryDetail4Mail0 = (id) => {
  http({
    // 查询详情的接口复用的, 这里需要手动处理一下传递的Map过程
    url: http.adornUrl('Guest/messages/detail'),
    method: 'get',
    params: {
      mesId: id,
      orderType: 1,
    }
  }).then(({data}) => {

    selectedMail.value = {
      id: data.id,
      clusterId: data.clusterId,
      senderId: data.senderId,
      receiverId: data.receiverId,
      status: data.status,
      droped: data.droped,
      header: data.header,
      senderName: data.senderName,
      receiverName: data.receiverName,
      clusterName: data.clusterName,
      body: data.body,
    };

  }).catch((error) => {
    ElMessage({
      message: '获取用户信件失败: ' + error.message,
      type: 'error',
      duration: 1000
    });
  });
}

// ! Delete


const deleteMail = (mail) => {
  const id = mail.id;
  http({
    url: http.adornUrl(`Guest/messages/delete/${id}`),
    method: 'delete',
  }).then(() => {

    listMyMes1();

  }).catch((error) => {
    ElMessage({
      message: '删除失败: ' + error.message,
      type: 'error',
      duration: 1000
    });
  });

}


</script>

<style lang="scss" scoped>

.user_mes_app_sender {

  .user_mes_app_sender_upper {
    display: flex;
    flex-direction: column;

    margin-top: -80px;
    margin-bottom: 5px;


    .refresh_button {
      width: 30px;
    }

  }

  .user_mes_app_sender_lower {
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


.user_mes_app_sender_close-button {
  display: flex;
  width: 15%;
  justify-content: center;
  margin-left: 30%;
  margin-top: 20px;
}

</style>
