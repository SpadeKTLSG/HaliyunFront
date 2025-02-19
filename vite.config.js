import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
    plugins: [vue()
        // 取消自动引入
    ], // 服务配置
    server: {
        host: true,
        port: 9876,
        open: true
    },
    // 解析配置
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'), // 设置 @ 指向 src
        }
    }
})
