import axios from 'axios'
import cookie from 'vue-cookies'
import {ElMessage} from 'element-plus'


/**
 * 响应对象
 */
let res = {
    code: '', data: '', message: ''
}

const http = axios.create({
    timeout: 1000 * 30, withCredentials: true, headers: {
        'Content-Type': 'application/json; charset=utf-8'
    }
})

/**
 * 请求拦截
 */
http.interceptors.request.use(config => {
    config.headers.Authorization = cookie.get('Authorization') // 请求头带上token
    config.headers.account = cookie.get('account') // 请求头带上account
    return config
}, error => {
    return Promise.reject(error)
})


/**
 * 响应拦截
 */
http.interceptors.response.use(response => {
    // blob 格式处理
    if (response.request.responseType === 'blob') {
        return response
    }

    // 获得响应数据
    res = response.data


    // 0 = 请求成功
    if (res.code === '0') {
        console.log('==============请求成功的响应数据==============', '\n', res, '\n', '==============响应数据 end==============')
        return res
    }


    // A = 客户端错误码
    if (res.message.startsWith("B")) {
        console.error('============== 请求异常 ==============', '\n', `接口地址: ${response.config.url.replace(import.meta.env.VITE_APP_BASE_API, '')}`, '\n', `异常信息: ${res}`, '\n', '============== 请求异常 end ==========')
        ElMessage({
            message: '请求参数错误', type: 'error', duration: 1.5 * 1000, customClass: 'element-error-message-zindex'
        })
        return Promise.reject(res)
    }

    // B = 服务端错误码
    if (res.message.startsWith("A")) {
        console.error('============== 请求异常 ==============', '\n', `接口地址: ${response.config.url.replace(import.meta.env.VITE_APP_BASE_API, '')}`, '\n', `异常信息: ${res}`, '\n', '============== 请求异常 end ==========')
        ElMessage({
            message: '服务器爆炸力', type: 'error', duration: 1.5 * 1000, customClass: 'element-error-message-zindex'
        })
        return Promise.reject(res)
    }

}, error => {

    console.log('========!!请求失败!!========', '\n', error.response, '\n', '========请求失败 end========')

    switch (error.response.status) {
        case 400:
            ElMessage({
                message: error.response.data, type: 'error', duration: 1500, customClass: 'element-error-message-zindex'
            })
            break
        case 401:
            ElMessage({
                message: '未授权', type: 'error', duration: 1500, customClass: 'element-error-message-zindex'
            })
            break
        case 405:
            ElMessage({
                message: 'http请求方式有误', type: 'error', duration: 1500, customClass: 'element-error-message-zindex'
            })
            break
        case 500:
            ElMessage({
                message: '服务器出了点小差, 请稍后再试', type: 'error', duration: 1500, customClass: 'element-error-message-zindex'
            })
            break
        case 501:
            ElMessage({
                message: '服务器不支持当前请求所需要的某个功能', type: 'error', duration: 1500, customClass: 'element-error-message-zindex'
            })
            break
    }
    return Promise.reject(error)
})

/**
 * 请求地址处理
 * @param {*} actionName action方法名称
 */
http.adornUrl = actionName => {
    return import.meta.env.VITE_APP_BASE_API + actionName
}

/**
 * 请求参数处理
 */
http.adornParams = (params = {}) => {
    return params
}

/**
 * post请求数据处理
 * @param {*} data 数据对象
 *  json: 'application/json; charset=utf-8'
 *  form: 'application/x-www-form-urlencoded; charset=utf-8'
 */
http.adornData = (data = {}) => {
    return JSON.stringify(data);
}


/**
 * 防止表单重复提交
 */
export const Debounce = (fn, t) => {
    const delay = t || 1000
    let timer
    return function () {
        const args = arguments
        if (timer) {
            clearTimeout(timer)
        }

        const callNow = !timer

        timer = setTimeout(() => {
            timer = null
        }, delay)

        if (callNow) fn.apply(this, args)
    }
}

/**
 * 校验是否URL地址
 */
export function isURL(s) {
    return /^https?:\/\/.*/.test(s)
}

export default http
