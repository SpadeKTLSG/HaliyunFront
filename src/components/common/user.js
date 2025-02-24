import {defineStore} from 'pinia'
import cookie from "vue-cookies";

/**
 * 用户信息缓存: http://localhost:10000/Guest/users/user_tl 获取
 */
export const useUserStore = defineStore('user', {
    state: () => {
        return {
            id: 0, admin: 0, loginType: 3, account: '', phone: '', token: ''
        }
    }, actions: {
        updateId(id) {
            this.id = id
        }, updateAdmin(admin) {
            this.admin = admin
        }, updateLoginType(loginType) {
            this.loginType = loginType
        }, updateAccount(account) {
            this.account = account
        }, updatePhone(phone) {
            this.phone = phone
        }, updateToken(token) {
            this.token = token
        }
    }
})


/**
 * 清除登录信息: 清除 token * 2 + localStorage
 */
export function clearLoginInfo() {
    cookie.remove('authorization')
    cookie.remove('account')
    localStorage.removeItem('user');
}

