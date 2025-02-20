import {createApp} from 'vue'
import {createPinia} from 'pinia'
import ElementPlus from 'element-plus'
import App from './App.vue'
import 'element-plus/dist/index.css'

const pinia = createPinia() // 用于 defineStore 页面存储

const app = createApp(App)
app.use(pinia)
app.use(ElementPlus)
app.mount('#app')
