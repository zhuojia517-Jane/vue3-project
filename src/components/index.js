//全局导入组件
import imageView from './imageView/index.vue'
import XtxSku from './XtxSku/index.vue'
export const componentsPlugin = {
    install(app) {
        //app.component(组件名字，组件)
        app.component('imageView', imageView)
        app.component('XtxSku', XtxSku)

    }

}