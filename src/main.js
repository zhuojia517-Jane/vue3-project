import '@/styles/common.scss'

import { createApp } from "vue";
import { createPinia } from "pinia";
import { componentsPlugin } from "@/components/index.js";
import App from "./App.vue";
import router from "./router";
import { lazyPlugin } from "@/directives/index.js"; //需要按需导入，因为之前的也是按需导出的，不能直接导入整个文件，否则会报错，提示找不到lazyPlugin
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate)
app.use(pinia);
app.use(router);
app.use(componentsPlugin);
app.use(lazyPlugin);
app.mount("#app");


