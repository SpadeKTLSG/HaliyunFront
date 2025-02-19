import {defineStore} from 'pinia'

/**
 * 用户信息  -> TL TODO
 */
export const useUserStore = defineStore('user', {
    state: () => {
        return {
            id: 0,
            name: '',
            userId: '',
            shopId: '',
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
        updateShopId(shopId) {
            this.shopId = shopId
        },
        updateUserId(userId) {
            this.userId = userId
        }
    }
})


/**
 * 清除登录信息
 */
export function clearLoginInfo() {
    cookie.remove('Authorization')
    router.options.isAddDynamicMenuRoutes = false
}

