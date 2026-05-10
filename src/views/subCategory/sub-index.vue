<script setup>

import { getCategoryFilterAPI, getSubCategoryAPI } from '@/apis/category.js'
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useElementSize } from '@vueuse/core'

import GoodsItem from '../category/components/GoodsItem.vue'
import VirtualList from '@/components/VirtualList.vue'

const filterData = ref({})
const route = useRoute()

const getCategoryFilter = async () => {
  const res = await getCategoryFilterAPI(route.params.id)
  filterData.value = res.result
}

const goodList = ref([])
const reqData = ref({
  categoryId: route.params.id,
  page: 1,
  pageSize: 20,
  sortField: 'publishTime'
})

const getGoodList = async () => {
  const res = await getSubCategoryAPI(reqData.value)
  goodList.value = res.result.items || []
}

const tabChange = () => {
  reqData.value.page = 1
  getGoodList()
}

const disabled = ref(false)
const load = async () => {
  reqData.value.page++
  const res = await getSubCategoryAPI(reqData.value)
  goodList.value = [...goodList.value, ...res.result.items]
  if (res.result.items.length === 0) disabled.value = true
}

const listContainer = ref(null)
const { height: containerHeight } = useElementSize(listContainer)
const vListHeight = computed(() => Math.max(containerHeight.value - 20, 400))

onMounted(() => {
  getCategoryFilter()
  getGoodList()
})
</script>

<template>
  <div class="container ">
    <!-- 面包屑 -->
    <div class="bread-container">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item v-if="filterData.parentId" :to="{ path: `/category/${filterData.parentId}` }">{{ filterData.parentName }}
        </el-breadcrumb-item>
        <el-breadcrumb-item>{{ filterData.name }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="sub-container" >
      <el-tabs v-model="reqData.sortField" @tab-change="tabChange">
        <el-tab-pane label="最新商品" name="publishTime"></el-tab-pane>
        <el-tab-pane label="最高人气" name="orderNum"></el-tab-pane>
        <el-tab-pane label="评论最多" name="evaluateNum"></el-tab-pane>
      </el-tabs>
      <div ref="listContainer" class="body">
        <VirtualList
          v-if="goodList.length"
          :items="goodList"
          :item-height="230"
          :item-width="185"
          :container-height="vListHeight"
          :gap="15"
          item-key="id"
          @load-more="load"
        >
          <template #item="{ item }">
            <GoodsItem :goods="item" />
          </template>
        </VirtualList>
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
    min-height: 400px;
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
</style>
