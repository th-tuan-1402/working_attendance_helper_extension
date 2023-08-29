import axios from "axios"
import { getStorageItem } from "./ChromeApiHelper";
import { login, loginKintai } from "./hitoCommonApi";

// Set config defaults when creating the instance
const instance = axios.create({
  validateStatus: function (status) {
    if (status == 403) {
      return false
    }

    return status < 500; // Resolve only if the status code is less than 500
  }
});

instance.interceptors.request.use(async config => {
  console.warn('request: ', config);

  // Add api token
  const tokenName = config.isKintaiSystem ? 'apiTokenKintai' : 'apiToken'
  const apiToken = await getStorageItem(tokenName)
  
  config.headers.Authorization = 'Bearer ' + apiToken

  return config
}, responseErrorHandler)

instance.interceptors.response.use(responseHandler, responseErrorHandler)

function responseHandler(response) {
  console.warn('response: ', response);
  return response
}

function responseErrorHandler(error) {
  console.warn('error', error);

  if (error.response) {
    if (error.response.status == 403) {
      console.warn('bad request')
      throw error
    } else if (error.response.status == 401) {
      console.warn('unauthoried')
      login()
      loginKintai()
    }
  }
}

export default instance