import { createRouter, createWebHistory } from "vue-router";

const login = () => import('@/views/login/login-index.vue')
const layout = () => import('@/views/layout/layout-index.vue')
const home = () => import('@/views/home/home-index.vue')
const category = () => import('@/views/category/category-index.vue')
const subCategory = () => import('@/views/subCategory/sub-index.vue')
const Detail = () => import('@/views/detail/index.vue')
const CartList = () => import('@/views/cartList/index.vue')
const checkout = () => import('@/views/checkout/index.vue')
const Pay = () => import('@/views/pay/index.vue')
const PayBack = () => import('@/views/pay/payback.vue')
const Member = () => import('@/views/member/member-index.vue')
const userInfo = () => import('@/views/member/components/userInfo.vue')
const userOrder = () => import('@/views/member/components/userOrder.vue')
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

        },
        {
          path: "cartlist/",
          component: CartList,

        },
        {
          path: 'checkout/',
          component: checkout
        },
        {
          path: 'pay',
          component: Pay
        },
        {
          path: 'paycallback',
          component: PayBack
        },
        {
          path: 'member',
          component: Member,
          children: [
            {
              path: '', //置空时可以默认展示三级路由界面
              component: userInfo
            },
            {
              path: 'order',
              component: userOrder
            }
          ]
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
