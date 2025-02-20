import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import ElementPlus from 'unplugin-element-plus/vite'

export default defineConfig({
    // 设置scss的api类型为modern-compiler
    css: {
        preprocessorOptions: {
            scss: {
                api: 'modern-compiler'
            }
        }
    },
    plugins: [vue(),
        ElementPlus({
            useSource: true // Enable source for better tree-shaking
        })
    ], // 服务配置
    server: {
        host: true, port: 9876, open: true
    }, // 解析配置
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'), // 设置 @ 指向 src
        }
    }
})
