import { ref, onMounted } from 'vue'
import { getCategoryAPI } from "@/apis/category";//注意具名导入
import { useRoute } from "vue-router"; //获取路由参数
import { onBeforeRouteUpdate } from "vue-router";
export function useCategory() {

  const categoryData = ref({})
  const route = useRoute()
  //提供了默认参数
  const getCategory = async (id = route.params.id) => {
    const res = await getCategoryAPI(id)
    categoryData.value = res.result
  }
  onMounted(() => getCategory()
  )
  //使用最新的路由参数来请求数据
  onBeforeRouteUpdate((to) => {
    getCategory(to.params.id)
  })
  return {
  categoryData
}




}
