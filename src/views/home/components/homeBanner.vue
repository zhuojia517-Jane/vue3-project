<script setup>
import { getBannerApi } from '@/apis/home'
import { onMounted, ref } from 'vue'

const bannerList = ref([])

const getBanner = async () => {
  const res = await getBannerApi()
  bannerList.value = res.result
}

onMounted(() => getBanner())

</script>



<template>
  <div class="home-banner">
    <el-carousel height="500px">
      <el-carousel-item v-for="item in bannerList" :key="item.id">
        <img :src="item.imgUrl" alt="">
      </el-carousel-item>
    </el-carousel>
  </div>
</template>



<style scoped lang='scss'>
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
