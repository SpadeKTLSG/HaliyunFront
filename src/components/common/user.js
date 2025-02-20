import {defineStore} from 'pinia'
import cookie from "vue-cookies";

/**
 * 用户信息  -> TL TODO
 */
export const useUserStore = defineStore('user', {
    state: () => {
        return {
            id: 0,
            name: '',
            userId: '',
            mobile: ''
        }
    },
    actions: {
        updateId(id) {
            this.id = id
        },
        updateName(name) {
            this.name = name
        },
        updateMobile(mobile) {
            this.mobile = mobile
        },
        updateUserId(userId) {
            this.userId = userId
        }
    }
})


/**
 * 清除登录信息 TODO
 */
export function clearLoginInfo() {
    cookie.remove('Authorization')
}

