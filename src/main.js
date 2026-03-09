import '@/styles/common.scss'

import { createApp } from "vue";
import { createPinia } from "pinia";
import { componentsPlugin } from "@/components/index.js";
import App from "./App.vue";
import router from "./router";
import { lazyPlugin } from "@/directives/index.js"; //需要按需导入，因为之前的也是按需导出的，不能直接导入整个文件，否则会报错，提示找不到lazyPlugin


const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(componentsPlugin);
app.use(lazyPlugin);
app.mount("#app");


