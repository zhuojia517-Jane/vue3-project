<script setup>
import HomeCategory from './components/homeCategory.vue'
import HomeBanner from './components/homeBanner.vue'
import HomeNew from './components/homeNew.vue'
import HomeHot from './components/homeHot.vue'
import HomeProduct from './components/homeProduct.vue'
// import HomePanel from './components/homePanel.vue'
</script>

<template>
  <div class="container">
    <HomeCategory />

  </div>
  <HomeBanner />
  <HomeNew />
  <HomeHot />
  <HomeProduct />
  <!-- //可以在index里面进行测试
  <HomePanel title="新鲜好物" subTitle="新鲜好物 好多商品">
    <slot>我是新鲜好物的插槽内容</slot>
  </HomePanel>

  <HomePanel title="人气推荐" subTitle="人气推荐 好多商品">
    <slot>我是人气推荐的插槽内容</slot>
  </HomePanel> -->
</template>
