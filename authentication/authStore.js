class AuthStore {
    constructor () {
        this.storageKey = 'roauthdata';
        this.authAvailable = this.authAvailable.bind(this);
        this.loadAuth = this.loadAuth.bind(this);
    }
    authAvailable () {
        if (localStorage.getItem(this.storageKey)) {
            return true;
        } else {
            return false;
        }
    }
    saveAuth (accountId, accessToken, refreshToken, expire) {
        if (!accountId || !accessToken || !refreshToken || !expire) {
            return false;
        } else {
            let authObject = {
                accountId: accountId,
                accessToken: accessToken,
                refreshToken: refreshToken,
                expire: expire
            };
            localStorage.setItem(this.storageKey, JSON.stringify(authObject));
            return true;
        }
    }
    loadAuth () {
        if (localStorage.getItem(this.storageKey)) {
            let authString = localStorage.getItem(this.storageKey);
            let authObject = JSON.parse(authString);
            return authObject;
        } else {
            return undefined;
        }
    }
    removeAuth () {
        localStorage.removeItem(this.storageKey);
    }
    accessToken () {
        let auth = this.loadAuth();
        if (auth && auth.accessToken) {
            return auth.accessToken;
        } else {
            return undefined;
        }
    }
    refreshToken () {
        let auth = this.loadAuth();
        if (auth && auth.refreshToken) {
            return auth.refreshToken;
        } else {
            return undefined;
        }
    }
    accountId () {
        let auth = this.loadAuth();
        if (auth && auth.accountId) {
            return auth.accountId;
        } else {
            return undefined;
        }
    }
    isExpired () {
        let auth = this.loadAuth();
        if (auth && auth.expire) {
            let now = Date.now();
            let expireDate = new Date(auth.expire).getTime();
            if (expireDate <= now) {
                return true;
            } else {
                return false;
            }
        }
    }
}
export default AuthStore
