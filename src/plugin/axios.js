import axios from "axios"

export function install({ chromeHelper }) {
  // Set config defaults when creating the instance
  const instance = axios.create({});

  async function requestHandler(config) {
    console.log('url: ', config.url, ', request: ', config);

    // Add api token
    const tokenName = config.isKintaiSystem ? 'apiTokenKintai' : 'apiToken'
    const apiToken = await chromeHelper.getStorageItem(tokenName)

    config.headers.Authorization = 'Bearer ' + apiToken

    // Set timeout as 10 minutes
    config.timeout = 600000

    return config
  }

  async function errorHandler(error) {
    console.log('url: ', error.config.url, ', error');
    console.error(error);

    return Promise.reject(error)
  }

  // Register request hanlder
  instance.interceptors.request.use(requestHandler, errorHandler)

  function responseHandler(response) {
    console.log('url: ', response.config.url, ', response: ', response);
    return response
  }

  // Register response hanlder
  instance.interceptors.response.use(responseHandler, errorHandler)

  return instance
}