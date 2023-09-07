import axios from './plugin/axios'
import { getStorageItem } from './ChromeApiHelper'

const HITO_DOMAIN = 'https://hito.lampart-vn.com'
const HITO_KINTAI_DOMAIN = 'https://backend-kintai-hito.lampart-vn.com'

export default {
    // API Url
    API_CHECK_TOKEN: HITO_DOMAIN + '/backend/v1/check_token',
    API_LOGIN: HITO_DOMAIN + '/backend/v1/login',
    API_KINTAI_LOGIN: HITO_KINTAI_DOMAIN + '/api/v1/user/login',
    API_KINTAI_STATUS: HITO_KINTAI_DOMAIN + '/api/v1/timestamp/clock',

    // Check token
    async isValidToken() {
        console.log('api isValidToken start');

        const isValid = await new Promise((resolve, reject) => {
            let isValid = false;

            axios.get(this.API_CHECK_TOKEN)
                .then(res => {
                    // If It has data => token is valid
                    // Otherwise      => token is invalid
                    isValid = res.status == 200 && res.data.success

                    resolve(isValid)
                })
                .catch(err => resolve(isValid))
        })

        console.log('api isValidToken end');

        return isValid
    },

    // Login
    async login(params) {
        console.log('api login start');

        const isValid = await new Promise((resolve, reject) => {
            let data = {
                success: false,
                data: null
            }

            axios.post(this.API_LOGIN, params)
                .then(res => {
                    data = res.data
                    resolve(data)
                })
                .catch(err => {
                    resolve(data)
                })
        })

        console.log('api login end');

        return isValid
    },

    // Login kintai
    async loginKintai() {
        console.log('api login kintai start');

        let params = {
            locale: 'vi',
            token: await getStorageItem('apiToken')
        }

        const isValid = await new Promise((resolve, reject) => {
            let data = {
                success: false,
                data: null
            }

            axios.post(this.API_KINTAI_LOGIN, params)
                .then(res => {
                    data = res.data
                    resolve(data)
                })
                .catch(err => {
                    resolve(data)
                })
        })

        console.log('api login kintai end');

        return isValid
    },

    // Get kintai status
    async getKintaiStatus() {
        console.log('api get kintai status start');

        const result = await new Promise((resolve, reject) => {
            let data = {
                success: false,
                data: null
            }

            axios.get(this.API_KINTAI_STATUS, { isKintaiSystem: true })
                .then(res => {
                    data = res.data
                    resolve(data)
                })
                .catch(err => {
                    resolve(data)
                })
        })

        console.log('api get kintai status end');
        return result
    },

    // Change kintai status
    async changeKintaiStatus(params) {
        console.log('api change kintai status start');

        const result = await new Promise((resolve, reject) => {
            let data = {
                success: false,
                data: null
            }

            axios.post(this.API_KINTAI_STATUS, params, { isKintaiSystem: true })
                .then(res => {
                    data = res.data
                    resolve(data)
                })
                .catch(err => {
                    // Whether it is already checked in, return as normal result
                    if (err.response?.status == 403) {
                        data.success = true
                    }

                    resolve(data)
                })
        })

        console.log('api change kintai status end');
        return result
    }
}