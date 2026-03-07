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
import { defineProps } from 'vue'

const props = defineProps({
    goods: {
        type: Object,
        default: () => ({})
    }
})
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
</style>
