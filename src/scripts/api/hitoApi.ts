import { ApiResponse, RequestParam } from '@/types/global'
import axios, { AxiosRequestConfig } from '@/plugins/axios'

const HITO_DOMAIN = process.env.VUE_APP_HITO_DOMAIN
const HITO_KINTAI_DOMAIN = process.env.VUE_APP_HITO_KINTAI_DOMAIN

export default {
  // API Url
  API_CHECK_TOKEN: HITO_DOMAIN + '/backend/v1/check_token',
  API_LOGIN: HITO_DOMAIN + '/backend/v1/login',
  API_KINTAI_CHECK_EXPIRED: HITO_KINTAI_DOMAIN + '/api/v1/user/check-expires',
  API_KINTAI_LOGIN: HITO_KINTAI_DOMAIN + '/api/v1/user/login',
  API_KINTAI_STATUS: HITO_KINTAI_DOMAIN + '/api/v1/timestamp/clock',
  API_KINTAI_APPROVE_WORKING: HITO_KINTAI_DOMAIN + '/api/v1/timestamp/working-time/works/approve-working',

  // Login
  async login(params: RequestParam): Promise<ApiResponse> {
    return new Promise(async (resolve, reject) => {
      let data: ApiResponse = {
        success: false,
        data: null
      }

      await axios
        .post(this.API_LOGIN, params)
        .then((res) => {
          data = res.data
          resolve(data)
        })
        .catch((e) => reject(e))
    })
  },

  // Check token expiration
  async checkKintaiToken(params: RequestParam): Promise<ApiResponse> {
    return await new Promise((resolve, reject) => {
      let data: ApiResponse = {
        success: false,
        data: null
      }

      axios
        .get(this.API_KINTAI_CHECK_EXPIRED, { accessToken: params.accessToken } as AxiosRequestConfig<string>)
        .then((res) => {
          data = res.data
          resolve(data)
        })
        .catch((e) => reject(e))
    })
  },

  // Login kintai
  async loginKintai(params: RequestParam): Promise<ApiResponse> {
    return new Promise(async (resolve, reject) => {
      let data: ApiResponse = {
        success: false,
        data: null
      }

      await axios
        .post(this.API_KINTAI_LOGIN, params)
        .then((res) => {
          data = res.data
          resolve(data)
        })
        .catch((e) => reject(e))
    })
  },

  // Get kintai status
  async getKintaiStatus(params: RequestParam): Promise<ApiResponse> {
    return await new Promise((resolve, reject) => {
      let data: ApiResponse = {
        success: false,
        data: null
      }

      axios
        .get(this.API_KINTAI_STATUS, { accessToken: params.accessToken } as AxiosRequestConfig<string>)
        .then((res) => {
          data = res.data
          resolve(data)
        })
        .catch((e) => reject(e))
    })
  },

  // Change kintai status
  async changeKintaiStatus(params): Promise<ApiResponse> {
    return await new Promise((resolve, reject) => {
      let data: ApiResponse = {
        success: false,
        data: null
      }

      axios
        .post(this.API_KINTAI_STATUS, params, { accessToken: params.accessToken } as AxiosRequestConfig<string>)
        .then((res) => {
          data = res.data
          resolve(data)
        })
        .catch((err) => {
          // Whether it is already checked in, return as normal result
          if (err.response?.status == 403) {
            data.success = true
            resolve(data)
          }

          reject(err)
        })
    })
  },

  // Approve working time
  async approveWorking(params): Promise<ApiResponse> {
    return await new Promise((resolve, reject) => {
      let data: ApiResponse = {
        success: false,
        data: null
      }

      axios
        .post(this.API_KINTAI_APPROVE_WORKING, params, {
          accessToken: params.accessToken
        } as AxiosRequestConfig<string>)
        .then((res) => {
          data = res.data
          resolve(data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }
}
