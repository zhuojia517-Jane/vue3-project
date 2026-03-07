import { ref, onMounted } from 'vue'
import { getBannerApi } from '@/apis/home'

export function useBanner() {
  const bannerList = ref([])
  const getBanner = async () => {
    try {
      const res = await getBannerApi()
      bannerList.value = res.result || []
    } catch (e) {
      console.error('useBanner error', e)
    }
  }

  onMounted(() => {
    getBanner()
  })

  return { bannerList }
}
