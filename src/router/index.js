import { createRouter, createWebHistory } from "vue-router";
//createRouter：创建router实例对象
//createWebHistory：创建history模式的路由
import login from "@/views/login/login-index.vue";
import layout from "@/views/layout/layout-index.vue";
import home from "@/views/home/home-index.vue";
import category from "@/views/category/category-index.vue";
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
          path: "category",
          component: category,
        },
      ],
    },
    {
      path: "/login",
      component: login,
    },
  ],
});

export default router;
