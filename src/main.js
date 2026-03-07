

import { createApp } from "vue";
import { createPinia } from "pinia";
import { useIntersectionObserver } from '@vueuse/core'

import App from "./App.vue";
import router from "./router";

// 定义懒加载插件
export const lazyPlugin = {
  install (app) {
    // 懒加载指令逻辑
    app.directive('img-lazy', {
      mounted (el, binding) {
        // el: 指令绑定的那个元素 img
        // binding: binding.value  指令等于号后面绑定的表达式的值  图片url
        console.log(el, binding.value)
        const { stop } = useIntersectionObserver(
          el,
          ([{ isIntersecting }]) => {
            console.log(isIntersecting)
            if (isIntersecting) {
              // 进入视口区域
              el.src = binding.value
              stop()
            }
          },
        )
      }
    })
  }
}

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(lazyPlugin);
app.mount("#app");


