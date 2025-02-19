import {createApp} from 'vue'
import {createPinia} from 'pinia'
import ElementPlus from 'element-plus'
import locale from 'element-plus/lib/locale/lang/zh-cn'
import App from './App.vue'
import moment from 'moment'
import 'element-plus/dist/index.css'

const pinia = createPinia() // 用于 defineStore 页面存储

const momentLocaleConfig = {
    longDateFormat: {
        LT: 'HH:mm',
        LTS: 'HH:mm:ss',
        L: 'YYYY-MM-DD',
        LL: 'YYYY年MM月DD日',
        LLL: 'YYYY年MM月DD日 HH:mm',
        LLLL: 'YYYY年MM月DD日 dddd HH:mm'
    }
}
moment.locale('zh-cn', momentLocaleConfig)


const app = createApp(App)
app.use(pinia)
app.use(ElementPlus, {locale})
app.mount('#app')
