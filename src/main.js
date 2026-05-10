import '@/styles/common.scss'

import { createApp } from "vue";
import { createPinia } from "pinia";
import { componentsPlugin } from "@/components/index.js";
import App from "./App.vue";
import router from "./router";
import { lazyPlugin } from "@/directives/index.js"; 
//export default lazyPlugin; //默认导出，导入时可以随意命名
//export const /export function命名导出，导入时必须使用相同的名字
//需要命名导入{}，因为之前的也是命名export const lazyPlugin=导出的，不能直接导入整个文件，否则会报错，提示找不到lazyPlugin
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate)
app.use(pinia);
app.use(router);
app.use(componentsPlugin);
app.use(lazyPlugin);
app.mount("#app");


