import axios from 'axios';
import AuthController from './authentication/authController';
import AuthStore from './authentication/authStore';

class HttpHelper {
    constructor (baseUrl = '', authApi) {
        this.http = axios.create({
            baseURL: baseUrl
        });
        this.authApi = authApi;
        this.config = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        };
        this.authStore = new AuthStore();
        this.authController = new AuthController(authApi);
        this.authenticationHeader = this.authenticationHeader.bind(this);
    }
    findGetParameter (parameterName) {
        let result = null;
        let tmp = [];
        let items = window.location.search.substr(1).split('&');
        for (let index = 0; index < items.length; index++) {
            tmp = items[index].split('=');
            if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
        }
        return result;
    }
    buildQuery (params) {
        let queryStr = '?';
        for (let key in params) {
            queryStr += key + '=' + params[key] + '&';
        }
        queryStr = queryStr.slice(0, -1);
        return queryStr;
    }

    authenticationHeader () {
        return new Promise((resolve) => {
            this.authController.getAccessToken().then(accessToken => {
                this.config.headers['Access-Token'] = accessToken;
                resolve();
            }).catch(() => {
                console.log('NO TOKEN IN AUTH DATA');
                resolve();
            });
        });
    }
    get (path, params) {
        const that = this;
        return new Promise((resolve, reject) => {
            that.authenticationHeader().then(() => {
                that.http.get(path + that.buildQuery(params), that.config)
                    .then(function (response) {
                        let result = response.data;
                        if (response.status === 200) {
                            resolve(result);
                        } else {
                            reject(result);
                        }
                    });
            }).catch((err) => {
                console.log(err);
            });
        });
    }
    post (path, params = {}) {
        const that = this;
        return new Promise((resolve, reject) => {
            that.authenticationHeader().then(() => {
                that.http.post(path, params, that.config)
                    .then(function (response) {
                        let result = response.data;
                        if (response.status === 200) {
                            resolve(result);
                        } else {
                            reject(result);
                        }
                    }).catch(error => {
                        alert('Credentials invalid');
                        reject(error);
                    });
            });
        });
    }
    put (path, params = {}) {
        const that = this;
        return new Promise((resolve, reject) => {
            that.authenticationHeader().then(() => {
                that.http.put(path, params, that.config)
                    .then(function (response) {
                        let result = response.data;
                        if (response.status === 200) {
                            resolve(result);
                        } else {
                            reject(result);
                        }
                    }).catch(error => {
                        console.log(error);
                        reject(error);
                    });
            });
        });
    }
    delete (path, params = {}) {
        const that = this;
        return new Promise((resolve, reject) => {
            that.authenticationHeader().then(() => {
                that.http.delete(path + that.buildQuery(params), that.config)
                    .then(function (response) {
                        let result = response.data;
                        if (response.status === 200) {
                            resolve(result);
                        } else {
                            reject(result);
                        }
                    }).catch(error => {
                        console.log(error);
                        reject(error);
                    });
            });
        });
    }
}

export default HttpHelper;
