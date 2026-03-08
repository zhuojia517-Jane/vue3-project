import { createRouter, createWebHistory } from "vue-router";
//createRouter：创建router实例对象
//createWebHistory：创建history模式的路由
import login from "@/views/login/login-index.vue";
import layout from "@/views/layout/layout-index.vue";
import home from "@/views/home/home-index.vue";
import category from "@/views/category/category-index.vue";
import subCategory from "@/views/subCategory/sub-index.vue";
import Detail from "@/views/detail/index.vue";
// 注意路径@后面要有/
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: layout,
      children: [
        {
          path: "",
          component: home,
        },
        {
          path: "category/:id",
          component: category,
        },
        {
          path: "category/sub/:id",
          component: subCategory,
        },
        {
          path: "detail/:id",
          component: Detail,

        }
      ],
    },
    {
      path: "/login",
      component: login,
    },
  ],
  scrollBehavior() {
    return { top: 0 }
  }
});

export default router;
