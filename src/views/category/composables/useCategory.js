import { ref, onMounted } from 'vue'
import { getCategoryAPI } from '@/apis/layout'

export function useCategory() {
  const categoryData = ref({ name: '', children: [] })

  const getData = async () => {
    try {
      const res = await getCategoryAPI()
      const list = res.result || []
      // 默认使用第一条数据,后续可根据路由参数查找
      if (list.length) {
        categoryData.value = list[0]
      }
    } catch (e) {
      console.error('useCategory error', e)
    }
  }

  onMounted(() => {
    getData()
  })

  return { categoryData }
}
