<template>
  <div class="goods-item">
    <img :src="goods.picture" alt="" v-if="goods.picture" />
    <div class="info">
      <h4 class="name">{{ goods.name || '商品名称' }}</h4>
      <p class="price">¥{{ goods.price || '--' }}</p>
    </div>
  </div>
</template>

<script setup>

</script>

<style scoped lang="scss">
.goods-item {
  width: 180px;
  border: 1px solid #eee;
  padding: 10px;
  text-align: center;

  img {
    width: 100px;
    height: 100px;
    object-fit: cover;
    margin-bottom: 8px;
  }

  .info {
    .name {
      font-size: 14px;
      color: #333;
      height: 34px;
      overflow: hidden;
    }

    .price {
      font-size: 16px;
      color: $priceColor;
    }
  }
}

.goods-item {
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 16px;
  transition: box-shadow 0.2s;
}

.goods-item:hover {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.goods-item img {
  width: 100%;
  height: 120px;
  /* 统一图片高度 */
  object-fit: contain;
  /* 保持图片比例 */
  margin-bottom: 8px;
}

.goods-item p {
  font-size: 14px;
  color: #333;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
