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
    config.headers.authorization = cookie.get('authorization') // 请求头带上token
    config.headers.account = cookie.get('account') // 请求头带上account
    console.log('请求拦截中设置的cookie', '\n', 'authorization:', cookie.get('authorization'), '\n', 'account:', cookie.get('account'))
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

    // 判断成功与否


    // 获得响应数据, 按照后端返回的数据格式进行解析
    res = response.data


    // 0 = 请求成功
    if (res.code === '0') {
        console.log('==============请求成功的响应数据==============', '\n', res.data, '\n', '==============响应数据 end==============')
        return res
    } else { // 1 = 请求失败
        console.error('============== 请求异常 ==============', '\n', `接口地址: ${response.config.url.replace("http://localhost:10000/", '')}`, '\n', `异常信息: ${res.message}`, '\n', '============== 请求异常 end ==========')
    }


    // A = 服务端错误码

    if (res.message.startsWith("A")) {
        console.error('============== 请求异常 ==============', '\n', `接口地址: ${response.config.url.replace("http://localhost:10000/", '')}`, '\n', `异常信息: ${res.message}`, '\n', '============== 请求异常 end ==========')
        ElMessage({
            message: '服务端错误', type: 'error', duration: 1.5 * 1000, customClass: 'element-error-message-zindex'
        })
        return Promise.reject(res)
    }


    // B = 客户端错误码
    if (res.message.startsWith("B")) {
        console.error('============== 请求异常 ==============', '\n', `接口地址: ${response.config.url.replace("http://localhost:10000/", '')}`, '\n', `异常信息: ${res.message}`, '\n', '============== 请求异常 end ==========')
        ElMessage({
            message: '客户端错误', type: 'error', duration: 1.5 * 1000, customClass: 'element-error-message-zindex'
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
    return "http://localhost:10000/" + actionName;
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
 * 校验是否URL地址
 */
http.isURL = s => {
    return /^https?:\/\/.*/.test(s)
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


export default http
