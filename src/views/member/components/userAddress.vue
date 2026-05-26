<script setup>
import { ref, onMounted } from 'vue'
import { getAddressListAPI, addAddressAPI, editAddressAPI, delAddressAPI } from '@/apis/address'
import { ElMessage } from 'element-plus'

const addressList = ref([])
const showDialog = ref(false)
const isEdit = ref(false)
const editId = ref('')
const addressFormRef = ref(null)

const addressForm = ref({
  receiver: '',
  contact: '',
  fullLocation: '',
  address: '',
  postalCode: '',
  isDefault: 0,
  addressTags: ''
})

const addressRules = {
  receiver: [{ required: true, message: '请输入收货人', trigger: 'blur' }],
  contact: [
    { required: true, message: '请输入联系方式', trigger: 'blur' },
    { pattern: /^1\d{10}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  fullLocation: [{ required: true, message: '请输入所在地区', trigger: 'blur' }],
  address: [{ required: true, message: '请输入详细地址', trigger: 'blur' }]
}

const fetchAddressList = async () => {
  const res = await getAddressListAPI()
  addressList.value = res.result
}

const openAddDialog = () => {
  isEdit.value = false
  editId.value = ''
  addressForm.value = {
    receiver: '',
    contact: '',
    fullLocation: '',
    address: '',
    postalCode: '',
    isDefault: 0,
    addressTags: ''
  }
  showDialog.value = true
}

const openEditDialog = (item) => {
  isEdit.value = true
  editId.value = item.id
  addressForm.value = { ...item }
  showDialog.value = true
}

const submitAddress = async () => {
  const valid = await addressFormRef.value.validate().catch(() => false)
  if (!valid) return
  try {
    if (isEdit.value) {
      await editAddressAPI({ ...addressForm.value, id: editId.value })
    } else {
      await addAddressAPI(addressForm.value)
    }
    showDialog.value = false
    await fetchAddressList()
    ElMessage.success(isEdit.value ? '地址修改成功' : '地址添加成功')
  } catch {
    // http interceptor handles
  }
}

const delAddress = async (id) => {
  try {
    await delAddressAPI(id)
    await fetchAddressList()
    ElMessage.success('地址删除成功')
  } catch {
    // http interceptor handles
  }
}

onMounted(() => fetchAddressList())
</script>

<template>
  <div class="address-manage">
    <div class="header">
      <h4>地址管理</h4>
      <el-button type="primary" @click="openAddDialog">添加新地址</el-button>
    </div>
    <div v-if="addressList.length === 0" class="empty">
      <el-empty description="暂无地址，请添加" />
    </div>
    <div v-else class="address-list">
      <div v-for="item in addressList" :key="item.id" class="address-card" :class="{ default: item.isDefault === 0 }">
        <div class="card-body">
          <div class="tags" v-if="item.isDefault === 0">
            <el-tag type="danger" size="small">默认</el-tag>
          </div>
          <ul>
            <li><span>收货人：</span>{{ item.receiver }}</li>
            <li><span>联系方式：</span>{{ item.contact }}</li>
            <li><span>收货地址：</span>{{ item.fullLocation }}{{ item.address }}</li>
            <li v-if="item.postalCode"><span>邮政编码：</span>{{ item.postalCode }}</li>
            <li v-if="item.addressTags"><span>标签：</span>{{ item.addressTags }}</li>
          </ul>
        </div>
        <div class="card-actions">
          <el-button text type="primary" size="small" @click="openEditDialog(item)">编辑</el-button>
          <el-popconfirm title="确认删除该地址?" confirm-button-text="确认" cancel-button-text="取消"
            @confirm="delAddress(item.id)">
            <template #reference>
              <el-button text type="danger" size="small">删除</el-button>
            </template>
          </el-popconfirm>
        </div>
      </div>
    </div>
  </div>

  <el-dialog v-model="showDialog" :title="isEdit ? '编辑地址' : '添加地址'" width="40%" center>
    <el-form ref="addressFormRef" :model="addressForm" :rules="addressRules" label-width="90px" status-icon>
      <el-form-item label="收货人" prop="receiver">
        <el-input v-model="addressForm.receiver" placeholder="请输入收货人" />
      </el-form-item>
      <el-form-item label="联系方式" prop="contact">
        <el-input v-model="addressForm.contact" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="所在地区" prop="fullLocation">
        <el-input v-model="addressForm.fullLocation" placeholder="如：湖北省武汉市洪山区" />
      </el-form-item>
      <el-form-item label="详细地址" prop="address">
        <el-input v-model="addressForm.address" placeholder="请输入详细地址" />
      </el-form-item>
      <el-form-item label="邮政编码">
        <el-input v-model="addressForm.postalCode" placeholder="请输入邮政编码" />
      </el-form-item>
      <el-form-item label="地址标签">
        <el-input v-model="addressForm.addressTags" placeholder="如：家、公司" />
      </el-form-item>
      <el-form-item label="设为默认">
        <el-switch v-model="addressForm.isDefault" :active-value="0" :inactive-value="1" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="showDialog = false">取消</el-button>
        <el-button type="primary" @click="submitAddress">保存</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
.address-manage {
  padding: 20px;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    h4 {
      font-size: 18px;
      font-weight: 400;
    }
  }

  .empty {
    padding: 40px 0;
  }

  .address-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .address-card {
    border: 1px solid #e4e4e4;
    border-radius: 4px;
    padding: 16px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;

    &.default {
      border-color: $xtxColor;
    }

    .card-body {
      flex: 1;

      .tags {
        margin-bottom: 8px;
      }

      ul {
        li {
          line-height: 28px;
          font-size: 14px;

          span {
            color: #999;
          }
        }
      }
    }

    .card-actions {
      display: flex;
      gap: 4px;
      flex-shrink: 0;
    }
  }
}
</style>
