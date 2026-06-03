<script setup>
import { getOrderAPI } from '@/apis/pay'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useCountdown } from '@/composables/countdown'

const { formatime, start } = useCountdown()
const route = useRoute()
const payInfo = ref({})

const getPayInfo = async () => {
  const res = await getOrderAPI(route.query.id)
  payInfo.value = res.result
  start(res.result.countdown)
}

const baseURL = 'http://pcapi-xiaotuxian-front-devtest.itheima.net/'
const backURL = 'http://127.0.0.1:5173/paycallback'
const redirectUrl = encodeURIComponent(backURL)
const payUrl = `${baseURL}pay/aliPay?orderId=${route.query.id}&redirect=${redirectUrl}`

const payTypeLabels = { 1: '在线支付', 2: '货到付款' }

onMounted(() => getPayInfo())
</script>


<template>
  <div class="xtx-pay-page">
    <div class="container">
      <div class="wrapper">
        <!-- 收货地址 -->
        <h3 class="box-title">收货地址</h3>
        <div class="box-body">
          <div class="address">
            <div class="text">
              <ul v-if="payInfo.receiverContact">
                <li><span>收<i />货<i />人：</span>{{ payInfo.receiverContact }}</li>
                <li><span>联系方式：</span>{{ payInfo.receiverMobile }}</li>
                <li><span>收货地址：</span>{{ payInfo.receiverAddress }}</li>
              </ul>
              <div v-else class="none-tip">暂无地址信息</div>
            </div>
          </div>
        </div>

        <!-- 商品信息 -->
        <h3 class="box-title">商品信息</h3>
        <div class="box-body">
          <table class="goods">
            <thead>
              <tr>
                <th width="520">商品信息</th>
                <th width="170">单价</th>
                <th width="170">数量</th>
                <th width="170">小计</th>
                <th width="170">实付</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in payInfo.skus" :key="item.id">
                <td>
                  <div class="info">
                    <img :src="item.image" alt="">
                    <div class="right">
                      <p>{{ item.name }}</p>
                      <p>{{ item.attrsText }}</p>
                    </div>
                  </div>
                </td>
                <td>&yen;{{ item.curPrice?.toFixed(2) }}</td>
                <td>{{ item.quantity }}</td>
                <td>&yen;{{ item.realPay?.toFixed(2) }}</td>
                <td>&yen;{{ item.realPay?.toFixed(2) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 订单信息 -->
        <h3 class="box-title">订单信息</h3>
        <div class="box-body">
          <div class="order-info">
            <dl>
              <dt>订单编号：</dt><dd>{{ payInfo.id }}</dd>
            </dl>
            <dl>
              <dt>下单时间：</dt><dd>{{ payInfo.createTime }}</dd>
            </dl>
            <dl>
              <dt>支付方式：</dt><dd>{{ payTypeLabels[payInfo.payType] || '在线支付' }}</dd>
            </dl>
            <dl v-if="payInfo.payLatestTime">
              <dt>支付截止：</dt><dd>{{ payInfo.payLatestTime }}</dd>
            </dl>
          </div>
        </div>

        <!-- 金额明细 -->
        <h3 class="box-title">金额明细</h3>
        <div class="box-body">
          <div class="total">
            <dl>
              <dt>商品件数：</dt>
              <dd>{{ payInfo.totalNum }}件</dd>
            </dl>
            <dl>
              <dt>商品总价：</dt>
              <dd>&yen;{{ payInfo.totalMoney?.toFixed(2) }}</dd>
            </dl>
            <dl>
              <dt>运<i></i>费：</dt>
              <dd>&yen;{{ payInfo.postFee?.toFixed(2) }}</dd>
            </dl>
            <dl>
              <dt>应付总额：</dt>
              <dd class="price">&yen;{{ payInfo.payMoney?.toFixed(2) }}</dd>
            </dl>
          </div>
        </div>

        <!-- 支付 -->
        <h3 class="box-title">付款方式</h3>
        <div class="box-body">
          <div class="pay-bar">
            <div class="pay-tip">
              <span class="icon iconfont icon-queren2"></span>
              <div class="tip-text">
                <p>订单提交成功！请尽快完成支付。</p>
                <p>支付还剩 <span class="countdown">{{ formatime }}</span>, 超时后将取消订单</p>
              </div>
            </div>
            <div class="pay-action">
              <p style="margin-bottom:10px;color:#999;">应付金额：<span class="price">&yen;{{ payInfo.payMoney?.toFixed(2) }}</span></p>
              <a class="btn alipay" :href="payUrl"></a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.xtx-pay-page {
  margin-top: 20px;

  .wrapper {
    background: #fff;
    padding: 0 20px 40px;

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

    >ul {
      flex: 1;
      padding: 20px;
      li {
        line-height: 30px;
        span {
          color: #999;
          margin-right: 5px;
          >i { width: 0.5em; display: inline-block; }
        }
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
    img { width: 70px; height: 70px; margin-right: 20px; }
    .right { line-height: 24px; p:last-child { color: #999; } }
  }

  tr {
    th { background: #f5f5f5; font-weight: normal; }
    td, th {
      text-align: center; padding: 20px;
      border-bottom: 1px solid #f5f5f5;
      &:first-child { border-left: 1px solid #f5f5f5; }
      &:last-child { border-right: 1px solid #f5f5f5; }
    }
  }
}

.order-info {
  dl {
    display: flex; line-height: 36px; font-size: 14px;
    dt { color: #999; width: 100px; text-align: right; }
    dd { color: #333; }
  }
}

.total {
  dl {
    display: flex; justify-content: flex-end; line-height: 50px;
    dt i { display: inline-block; width: 2em; }
    dd {
      width: 240px; text-align: right; padding-right: 70px;
      &.price { font-size: 20px; color: $priceColor; }
    }
  }
}

.pay-bar {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  .pay-tip {
    display: flex; align-items: center;
    .icon { font-size: 60px; color: #1dc779; margin-right: 15px; }
    .tip-text {
      p:first-child { font-size: 18px; margin-bottom: 5px; }
      p:last-child { color: #999; font-size: 14px; }
      .countdown { color: $priceColor; font-weight: bold; }
    }
  }

  .pay-action {
    text-align: right;
    .price { color: $priceColor; font-size: 22px; font-weight: bold; }
    .btn {
      display: inline-block;
      width: 180px; height: 55px; margin-top: 8px;
      &.alipay {
        background: url(https://cdn.cnbj1.fds.api.mi-img.com/mi-mall/7b6b02396368c9314528c0bbd85a2e06.png) no-repeat center / contain;
      }
    }
  }
}

.none-tip {
  text-align: center; color: #999; padding: 40px 0; font-size: 14px; width: 100%;
}
</style>