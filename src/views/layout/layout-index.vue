<script setup>
import LayoutNav from './components/layoutNav.vue'
import LayoutHeader from './components/layoutHeader.vue'
import LayoutFooter from './components/layoutFooter.vue'
</script>
<template>
  <div>我是首页
    <!-- 二级路由出口处 -->
    <LayoutNav />
    <LayoutHeader />
    <RouterView />
    <LayoutFooter />
  </div>
</template>
