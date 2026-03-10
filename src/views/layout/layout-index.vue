<script setup>

import LayoutNav from './components/layoutNav.vue'
import LayoutHeader from './components/layoutHeader.vue'
import LayoutFooter from './components/layoutFooter.vue'
import LayoutFixed from './components/layoutFixed.vue'

// 触发获取导航列表的action

import { useCategoryStore } from '@/stores/categoryStore'
import { onMounted } from 'vue'

const categoryStore = useCategoryStore()

onMounted(() => categoryStore.getCategory())
</script>

<template>
  <LayoutFixed />
  <LayoutNav />
  <LayoutHeader />
  <!-- 添加key 破坏复用机制 强制销毁重建 -->
  <!-- <RouterView :key="$route.fullPath" /> -->
  
  <RouterView />
  <LayoutFooter />
</template>
