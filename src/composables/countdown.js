import { ref, onUnmounted } from 'vue'
import dayjs from 'dayjs'
export const useCountdown = () => {
    //将最后返回的时间格式化（由一个属性得到另一个属性，计算属性）
    const formatime = computed(() => dayjs.unix(time.value).format('mm分ss秒'))
    let time = ref(0)
    let timer = null

    const start = (currentTime) => {
        time.value = currentTime
    }


    timer = setInterval(() => {
        time.value--
    }, 1000)
    onUnmounted(() => timer && clearInterval(timer))
    return {
        formatime,
        start
    }

}