/**
 * Set local storage item
 *
 * @param {*} items 
 * @returns 
 */
export async function setStorageItem(items) {
  return await chrome.storage.local.set(items)
}

/**
 * Get local storage item
 *
 * @param {*} key 
 * @returns 
 */
export async function getStorageItem(key) {
  return await chrome.storage.local.get([key]).then(result => result[key])
}

/**
 * Remove local storage item
 *
 * @param {*} key 
 * @returns 
 */
export async function removeStorageItem(key) {
  return await chrome.storage.local.remove([key])
}

/**
 * Emit notification
 *
 * @static
 * @param {*} title   
 * @param {*} message notification message
 * @param {*} url     callback url
 */
export function notify(title='notification', message, url='') {
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