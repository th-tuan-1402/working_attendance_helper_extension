import axios from "axios"
import { getStorageItem, removeStorageItem, setStorageItem } from "../ChromeApiHelper";
import { refreshToken } from "../hitoCommonApi";

// Set config defaults when creating the instance
const instance = axios.create({
  /** Validate responce status
  /* @param {number} status responce status
  /* @returns {boolean} true: error, false otherwise
  */
  validateStatus(status) {
    if (status == 403 || status == 401) {
      return false
    }

    return status < 500; // Resolve only if the status code is less than 500
  }
});

instance.interceptors.request.use(async config => {
  console.log('url: ', config.url, ', request: ', config);

  // Add api token
  const tokenName = config.isKintaiSystem ? 'apiTokenKintai' : 'apiToken'
  const apiToken = await getStorageItem(tokenName)

  config.headers.Authorization = 'Bearer ' + apiToken

  return config
}, responseErrorHandler)

instance.interceptors.response.use(responseHandler, responseErrorHandler)

function responseHandler(response) {
  console.log('url: ', response.config.url, ', response: ', response);
  return response
}

async function responseErrorHandler(error) {
  console.log('url: ', error.config.url, ', error');
  console.error(error);

  if (error.response) {
    if (error.response.status == 401) {
      if (error.response) {
        if (error.response.status == 403) {
          console.warn('bad request')
          throw error
        }
      }
    }
  }

  return Promise.reject(error)
}

export default instance