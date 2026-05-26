<script setup>
import { defineAsyncComponent } from 'vue'

const CustomerService = defineAsyncComponent(() =>
  import('@/components/CustomerService.vue')
)
</script>

<template>
  <RouterView />
  <CustomerService />
</template>
