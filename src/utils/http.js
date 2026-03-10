//axios基础封装
import axios from "axios";
import { ElMessage } from 'element-plus'
import 'element-plus/theme-chalk/el-message.css'
import { useUserStore } from '@/stores/user.js'
const httpInstance = axios.create({
  baseURL: "http://pcapi-xiaotuxian-front-devtest.itheima.net",
  timeout: 5000,
});
//拦截器
// axios请求拦截器
httpInstance.interceptors.request.use(
  config => {
    // 定义数据
    const userStore = useUserStore()
    //根据后端要求，携带token
    const token = userStore.userInfo.token
    if (token) { config.headers.authorization = `Bearer ${token}` }

    return config;
  },
  (e) => Promise.reject(e),
);

// axios响应式拦截器
httpInstance.interceptors.response.use(
  (res) => res.data,

  (e) => {
    //登录失败的业务逻辑，返回消息
    ElMessage(
      {
        type: 'warning',
        message: e.response.data.message
      }
    )
    return Promise.reject(e);
  },
);

export default httpInstance;
