export default class ChromeHelper {
  constructor(chrome) {
    this.chrome = chrome;
    this.localStorage = this.chrome.storage.local
  }

  /**
 * Set local storage item
 *
 * @param {*} items 
 * @returns 
 */
  async setStorageItem(items) {
    return await this.localStorage.set(items)
  }

  /**
   * Get local storage item
   *
   * @param {*} key 
   * @returns 
   */
  async getStorageItem(key) {
    return await this.localStorage.get([key]).then(result => result[key])
  }

  /**
   * Remove local storage item
   *
   * @param {*} key 
   * @returns 
   */
  async removeStorageItem(key) {
    return await this.localStorage.remove([key])
  }

  /**
   * Emit notification
   *
   * @static
   * @param {*} title   
   * @param {*} message notification message
   * @param {*} url     callback url
   */
  notify(title = 'notification', message, url = '') {
    chrome.runtime.sendMessage('', {
      type: 'notification',
      url,
      options: {
        title: title,
        message: message,
        iconUrl: 'https://hito.lampart-vn.com/static/imgs/favicon.ico',
        type: 'basic'
      }
    });
  }
}