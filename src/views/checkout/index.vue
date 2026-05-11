<script setup>
import {useRouter} from 'vue-router'

import {ref,onMounted} from 'vue'
import {getCheckoutInfoAPI,createOrderAPI} from '@/apis/checkout'
import { addAddressAPI, editAddressAPI, delAddressAPI } from '@/apis/address'
import { ElMessage } from 'element-plus'
import{useCartStore} from '@/stores/cartStore'
const cartStore=useCartStore()
const checkInfo = ref({})  // 订单对象
const curAddress = ref({})  // 地址对象
const showDialog=ref(false) //是否展示切换地址弹框
const activeAddress=ref({})  // 选中的地址对象
const addFlag=ref(false) // 是否展示添加地址弹框
const router=useRouter()
const getCheckoutInfo=async ()=>{
    const res =await getCheckoutInfoAPI()
    checkInfo.value=res.result
    const item = checkInfo.value.userAddresses.find(item=>item.isDefault===0)
    curAddress.value=item
}
onMounted( ()=>{
    getCheckoutInfo()
})

const confirm=()=>{
    showDialog.value=false
    curAddress.value=activeAddress.value
}
const switchAddress=(item)=>{
activeAddress.value=item
}
const createOrder=async()=>{
  const res=await createOrderAPI({
    
    deliveryTimeType:1,
    payType:1,
    payChannel:1,
    buyerMessage:'',
    goods:checkInfo.value.goods.map(item=>{return{skuId:item.skuId,count:item.count}}),
    addressId:curAddress.value.id
  })
  const orderId=res.result.id
  router.push({
    path:'/pay',
    query:{id:orderId}
  })
  cartStore.updateCartList()
}

// 地址表单数据
const addressForm = ref({
  receiver: '',
  contact: '',
  fullLocation: '',
  address: '',
  postalCode: '',
  isDefault: 0,
  addressTags: ''
})
const addressFormRef = ref(null)
const isEdit = ref(false)
const editId = ref('')

const addressRules = {
  receiver: [{ required: true, message: '请输入收货人', trigger: 'blur' }],
  contact: [
    { required: true, message: '请输入联系方式', trigger: 'blur' },
    { pattern: /^1\d{10}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  fullLocation: [{ required: true, message: '请输入所在地区', trigger: 'blur' }],
  address: [{ required: true, message: '请输入详细地址', trigger: 'blur' }]
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
  addFlag.value = true
}

const openEditDialog = (item) => {
  isEdit.value = true
  editId.value = item.id
  addressForm.value = { ...item }
  addFlag.value = true
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
    addFlag.value = false
    await getCheckoutInfo()
    ElMessage.success(isEdit.value ? '地址修改成功' : '地址添加成功')
  } catch {
    // error handled by http interceptor
  }
}

const delAddress = async (id) => {
  try {
    await delAddressAPI(id)
    await getCheckoutInfo()
    ElMessage.success('地址删除成功')
  } catch {
    // error handled by http interceptor
  }
}

</script>

<template>
  <div class="xtx-pay-checkout-page">
    <div class="container">
      <div class="wrapper">
        <!-- 收货地址 -->
        <h3 class="box-title">收货地址</h3>
        <div class="box-body">
          <div class="address">
            <div class="text">
              <div class="none" v-if="!curAddress">您需要先添加收货地址才可提交订单。</div>
              <ul v-else>
                <li><span>收<i />货<i />人：</span>{{ curAddress.receiver }}</li>
                <li><span>联系方式：</span>{{ curAddress.contact }}</li>
                <li><span>收货地址：</span>{{ curAddress.fullLocation }} {{ curAddress.address }}</li>
              </ul>
            </div>
            <div class="action">
              <el-button size="large" @click="showDialog = true" >切换地址</el-button>
              <el-button size="large" @click="openAddDialog()">添加地址</el-button>
            </div>
          </div>
        </div>
        <!-- 商品信息 -->
        <h3 class="box-title">商品信息</h3>
        <div class="box-body">
          <table class="goods">
            <thead>
              <tr>
                <th width="520">信息</th>
                <th width="170">价格</th>
                <th width="170">数量</th>
                <th width="170">小计</th>
                <th width="170">实付</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="i in checkInfo.goods" :key="i.id">
                <td>
                  <a href="javascript:;" class="info">
                    <img :src="i.picture" alt="">
                    <div class="right">
                      <p>{{ i.name }}</p>
                      <p>{{ i.attrsText }}</p>
                    </div>
                  </a>
                </td>
                <td>&yen;{{ i.price }}</td>
                <td>{{ i.price }}</td>
                <td>&yen;{{ i.totalPrice }}</td>
                <td>&yen;{{ i.totalPayPrice }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- 配送时间 -->
        <h3 class="box-title">配送时间</h3>
        <div class="box-body">
          <a class="my-btn active" href="javascript:;">不限送货时间：周一至周日</a>
          <a class="my-btn" href="javascript:;">工作日送货：周一至周五</a>
          <a class="my-btn" href="javascript:;">双休日、假日送货：周六至周日</a>
        </div>
        <!-- 支付方式 -->
        <h3 class="box-title">支付方式</h3>
        <div class="box-body">
          <a class="my-btn active" href="javascript:;">在线支付</a>
          <a class="my-btn" href="javascript:;">货到付款</a>
          <span style="color:#999">货到付款需付5元手续费</span>
        </div>
        <!-- 金额明细 -->
        <h3 class="box-title">金额明细</h3>
        <div class="box-body">
          <div class="total">
            <dl>
              <dt>商品件数：</dt>
              <dd>{{ checkInfo.summary?.goodsCount }}件</dd>
            </dl>
            <dl>
              <dt>商品总价：</dt>
              <dd>&yen;{{ checkInfo.summary?.totalPrice?.toFixed(2) }}</dd>
            </dl>
            <dl>
              <dt>运<i></i>费：</dt>
              <dd>&yen;{{ checkInfo.summary?.postFee?.toFixed(2) }}</dd>
            </dl>
            <dl>
              <dt>应付总额：</dt>
              <dd class="price">&yen;{{ checkInfo.summary?.totalPayPrice?.toFixed(2) }}</dd>
            </dl>
          </div>
        </div>
        <!-- 提交订单 -->
        <div class="submit">
          <el-button type="primary" size="large" @click="createOrder">提交订单</el-button>
        </div>
      </div>
    </div>
  </div>
  <!-- 切换地址 -->
  <el-dialog v-model="showDialog" title="切换收货地址" width="35%" center>
    <div class="addressWrapper">
      <div v-for="item in checkInfo.userAddresses" :key="item.id"
        class="address-item" :class="{ active: activeAddress.id === item.id }"
        @click="switchAddress(item)">
        <ul>
          <li><span>收<i />货<i />人：</span>{{ item.receiver }}</li>
          <li><span>联系方式：</span>{{ item.contact }}</li>
          <li><span>收货地址：</span>{{ item.fullLocation }} {{ item.address }}</li>
        </ul>
        <div class="address-actions" @click.stop>
          <el-button text type="primary" size="small" @click="openEditDialog(item)">编辑</el-button>
          <el-popconfirm title="确认删除该地址?" confirm-button-text="确认" cancel-button-text="取消"
            @confirm="delAddress(item.id)">
            <template #reference>
              <el-button text type="danger" size="small">删除</el-button>
            </template>
          </el-popconfirm>
        </div>
      </div>
      <div v-if="!checkInfo.userAddresses?.length" class="none-tip">暂无地址，请添加</div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="showDialog = false">取消</el-button>
        <el-button type="primary" @click="confirm">确定</el-button>
      </span>
    </template>
  </el-dialog>

  <!-- 添加/编辑地址 -->
  <el-dialog v-model="addFlag" :title="isEdit ? '编辑地址' : '添加地址'" width="40%" center>
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
        <el-button @click="addFlag = false">取消</el-button>
        <el-button type="primary" @click="submitAddress">保存</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
@use "sass:color";
.xtx-pay-checkout-page {
  margin-top: 20px;

  .wrapper {
    background: #fff;
    padding: 0 20px;

    .box-title {
      font-size: 16px;
      font-weight: normal;
      padding-left: 10px;
      line-height: 70px;
      border-bottom: 1px solid #f5f5f5;
    }

    .box-body {
      padding: 20px 0;
    }
  }
}

.address {
  border: 1px solid #f5f5f5;
  display: flex;
  align-items: center;

  .text {
    flex: 1;
    min-height: 90px;
    display: flex;
    align-items: center;

    .none {
      line-height: 90px;
      color: #999;
      text-align: center;
      width: 100%;
    }

    >ul {
      flex: 1;
      padding: 20px;

      li {
        line-height: 30px;

        span {
          color: #999;
          margin-right: 5px;

          >i {
            width: 0.5em;
            display: inline-block;
          }
        }
      }
    }

    >a {
      color: $xtxColor;
      width: 160px;
      text-align: center;
      height: 90px;
      line-height: 90px;
      border-right: 1px solid #f5f5f5;
    }
  }

  .action {
    width: 420px;
    text-align: center;

    .btn {
      width: 140px;
      height: 46px;
      line-height: 44px;
      font-size: 14px;

      &:first-child {
        margin-right: 10px;
      }
    }
  }
}

.goods {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;

  .info {
    display: flex;
    text-align: left;

    img {
      width: 70px;
      height: 70px;
      margin-right: 20px;
    }

    .right {
      line-height: 24px;

      p {
        &:last-child {
          color: #999;
        }
      }
    }
  }

  tr {
    th {
      background: #f5f5f5;
      font-weight: normal;
    }

    td,
    th {
      text-align: center;
      padding: 20px;
      border-bottom: 1px solid #f5f5f5;

      &:first-child {
        border-left: 1px solid #f5f5f5;
      }

      &:last-child {
        border-right: 1px solid #f5f5f5;
      }
    }
  }
}

.my-btn {
  width: 228px;
  height: 50px;
  border: 1px solid #e4e4e4;
  text-align: center;
  line-height: 48px;
  margin-right: 25px;
  color: #666666;
  display: inline-block;

  &.active,
  &:hover {
    border-color: $xtxColor;
  }
}

.total {
  dl {
    display: flex;
    justify-content: flex-end;
    line-height: 50px;

    dt {
      i {
        display: inline-block;
        width: 2em;
      }
    }

    dd {
      width: 240px;
      text-align: right;
      padding-right: 70px;

      &.price {
        font-size: 20px;
        color: $priceColor;
      }
    }
  }
}

.submit {
  text-align: right;
  padding: 60px;
  border-top: 1px solid #f5f5f5;
}

.addressWrapper {
  max-height: 500px;
  overflow-y: auto;
}

.address-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #f5f5f5;
  margin-bottom: 10px;
  padding: 10px;
  cursor: pointer;
  border-radius: 4px;

  &.active,
  &:hover {
    border-color: $xtxColor;
    background: color.adjust($xtxColor, $lightness: 50%, $space: hsl);
  }

  >ul {
    flex: 1;
    font-size: 14px;
    line-height: 30px;
    padding: 0;
    margin: 0;

    li span {
      color: #999;
      margin-right: 5px;

      >i {
        width: 0.5em;
        display: inline-block;
      }
    }
  }
}

.address-actions {
  display: flex;
  gap: 4px;
  flex-shrink: 0;
}

.none-tip {
  text-align: center;
  color: #999;
  padding: 40px 0;
  font-size: 14px;
}
</style>