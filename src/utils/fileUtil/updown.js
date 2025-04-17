import cookie from "vue-cookies";
import axios from "axios";

/**
 * 上传文件
 * ? 然而没有用到
 */
export const uploadFile = function (url, file) {
    const config = {
        // 添加请求头
        headers: {
            'Content-Type': 'multipart/form-data',
            authorization: cookie.get('authorization'),
            account: cookie.get('account')
        }
    }
    const param = new FormData()
    // 通过append向form对象添加数据
    param.append('file', file)
    return axios.post(url, param, config)
}
