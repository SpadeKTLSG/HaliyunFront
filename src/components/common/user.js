import cookie from "vue-cookies";


/**
 * 清除登录信息: 清除 token * 2 + localStorage
 */
export function clearLoginInfo() {
    cookie.remove('authorization')
    cookie.remove('account')
    localStorage.removeItem('user');
}

