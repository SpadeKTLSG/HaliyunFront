import cookie from "vue-cookies";

const USER_KEY = 'user';

/**
 * UserTL 用户信息保存的类声明
 */
export class UserTL {
    constructor(id, account, phone, loginType, admin, token, expiry) {
        this.id = id;
        this.account = account;
        this.phone = phone;
        this.loginType = loginType;
        this.admin = admin;

        this.token = token;
        this.expiry = expiry;
    }
}


/**
 * UserContext 用户上下文, 使用localStorage模拟
 * @type {{getUser(): (any|null), clearUser(): void, setUser(*): void}}
 */
export const UserContext = {

    /**
     * 设置用户
     * @param user
     */
    setUser(user) {
        const userWithExpiry = new UserTL(
            user.id,
            user.account,
            user.phone,
            user.loginType,
            user.admin,
            user.token,
            new Date().getTime() + 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
        );
        localStorage.setItem(USER_KEY, JSON.stringify(userWithExpiry));
        // console.log('用户信息已经保存到localStorage');
    },

    /**
     * 获取用户
     * @returns {any|null}
     */
    getUser() {
        const user = JSON.parse(localStorage.getItem(USER_KEY));
        if (user) {
            const now = new Date().getTime();
            if (now < user.expiry) {
                return new UserTL(
                    user.id,
                    user.account,
                    user.phone,
                    user.loginType,
                    user.admin,
                    user.token,
                    user.expiry
                );
            } else {
                this.clearUser();
            }
        }
        return null;
    },

    getUserAccount() {
        const user = this.getUser();
        return user ? user.account : null;
    },

    getUserId() {
        const user = this.getUser();
        return user ? user.id : null;
    },

    /**
     * 清除TL: 清除 token * 2 + localStorage
     */
    clearUser() {
        localStorage.removeItem(USER_KEY);
        cookie.remove('authorization');
        cookie.remove('account');
    }
};

