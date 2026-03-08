<script setup>
import { getCategoryAPI } from "@/apis/category";//注意具名导入
import { onUpdated, ref, onMounted } from "vue";
import { useRoute } from "vue-router"; //获取路由参数
import { getBannerApi } from '@/apis/home'
const categoryData = ref({})
const route = useRoute()
const getCategory = async () => {
  const res = await getCategoryAPI(route.params.id)
  categoryData.value = res.result
}
onUpdated(() => {
  getCategory()
})
const bannerList = ref([])

const getBanner = async () => {
  const res = await getBannerApi({ distributionSite: '2' })
  console.log(res)
  bannerList.value = res.result
}

onMounted(() => getBanner())
</script>

<template>
  <div class="container ">
    <!-- 面包屑 -->
    <div class="bread-container">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>{{ categoryData.name }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div>
      <div class="home-banner">
        <el-carousel height="500px">
          <el-carousel-item v-for="item in bannerList" :key="item.id">
            <img :src="item.imgUrl" alt="">
          </el-carousel-item>
        </el-carousel>
      </div>
    </div>
    <div class="sub-container">
      <el-tabs>
        <el-tab-pane label="最新商品" name="publishTime"></el-tab-pane>
        <el-tab-pane label="最高人气" name="orderNum"></el-tab-pane>
        <el-tab-pane label="评论最多" name="evaluateNum"></el-tab-pane>
      </el-tabs>
      <div class="body">
        <!-- 商品列表-->
      </div>
    </div>
  </div>

</template>



<style lang="scss" scoped>
.bread-container {
  padding: 25px 0;
  color: #666;
}

.sub-container {
  padding: 20px 10px;
  background-color: #fff;

  .body {
    display: flex;
    flex-wrap: wrap;
    padding: 0 10px;
  }

  .goods-item {
    display: block;
    width: 220px;
    margin-right: 20px;
    padding: 20px 30px;
    text-align: center;

    img {
      width: 160px;
      height: 160px;
    }

    p {
      padding-top: 10px;
    }

    .name {
      font-size: 16px;
    }

    .desc {
      color: #999;
      height: 29px;
    }

    .price {
      color: $priceColor;
      font-size: 20px;
    }
  }

  .pagination-container {
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }


}

.home-banner {
  max-width: 1240px;
  width: 100%;
  margin: 0 auto;

  img {
    width: 100%;
    height: auto;
    object-fit: cover;
  }
}
</style>
