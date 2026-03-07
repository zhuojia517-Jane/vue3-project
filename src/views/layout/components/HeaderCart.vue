<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goCart = () => {
    router.push('/cart')
}
</script>

<template>
    <div class="cart">
        <a href="javascript:;" class="curr" @click="goCart">
            <i class="iconfont icon-cart"></i>
            <em>0</em>
        </a>
    </div>
</template>

<style scoped lang="scss">
.cart {
    width: 50px;

    .curr {
        height: 32px;
        line-height: 32px;
        text-align: center;
        position: relative;
        display: block;

        .icon-cart {
            font-size: 22px;
        }

        em {
            font-style: normal;
            position: absolute;
            right: 0;
            top: 0;
            padding: 1px 6px;
            line-height: 1;
            background: $helpColor;
            color: #fff;
            font-size: 12px;
            border-radius: 10px;
            font-family: Arial;
        }
    }
}
</style>
