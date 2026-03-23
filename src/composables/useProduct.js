import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getDetailAPI } from '@/apis/detail'

export function useProduct() {
  const product = ref({})
  const route = useRoute()

  const getProduct = async () => {
    try {
      const res = await getDetailAPI(route.params.id)
      product.value = res.result
    } catch (error) {
      console.error('Failed to fetch product details:', error)
    }
  }

  onMounted(() => {
    getProduct()
  })

  return {
    product,
    getProduct
  }
}
