import CryptoJS from 'crypto-js'


// 加密工具类


const ezKeyStr = 'haliyun' // 解密用的key

/**
 * 简单的对称加密算法, 加密方式: 时间戳 + 密文
 * @param word
 * @returns {string}
 */
export function encrypt(word) {
    const time = Date.now()

    const key = CryptoJS.enc.Utf8.parse(ezKeyStr)
    const srcs = CryptoJS.enc.Utf8.parse(time + word)
    const encrypted = CryptoJS.AES.encrypt(srcs, key, {
        mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7
    })
    return encrypted.toString()
}

/**
 * 更简单的对称加密算法, 加密方式: 密文
 * @param word
 * @returns {string}
 */
export function ezEncrypt(word) {
    const key = CryptoJS.enc.Utf8.parse(ezKeyStr)
    const srcs = CryptoJS.enc.Utf8.parse(word)
    const encrypted = CryptoJS.AES.encrypt(srcs, key, {
        mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7
    })
    return encrypted.toString()
}

