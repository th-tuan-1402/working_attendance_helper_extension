import axios, { InternalAxiosRequestConfig, AxiosResponse } from 'axios'

export interface AxiosRequestConfig<T> extends InternalAxiosRequestConfig<T> {
  accessToken?: string
}

// Set config defaults when creating the instance
const instance = axios.create()

function requestHandler(config: AxiosRequestConfig<any>) {
  console.log('url: ', config.url, ', request: ', config)

  // Set access token
  if (config.data?.accessToken || config?.accessToken) {
    const token = config.data?.accessToken ?? config?.accessToken
    config.headers.Authorization = 'Bearer ' + token
  }

  // Set timeout as 10 minutes
  config.timeout = 600000

  return config
}

function requestErrorHandler(error: any): Promise<any> {
  console.log('url: ', error.config.url, ', error')
  console.error(error)

  return Promise.reject(error)
}

// Register request hanlder
instance.interceptors.request.use(requestHandler, requestErrorHandler)

function responseHandler(response: AxiosResponse<any, any>) {
  console.log('url: ', response.config.url, ', response: ', response)
  return response
}

function responseErrorHandler(error: any): Promise<any> {
  console.log('url: ', error.config.url, ', error')
  console.error(error)

  return Promise.reject(error)
}

// Register response hanlder
instance.interceptors.response.use(responseHandler, responseErrorHandler)

export default instance
