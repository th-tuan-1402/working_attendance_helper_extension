export async function setStorageItem(items) {
  return await chrome.storage.local.set(items)
}

export async function getStorageItem(key) {
  return await chrome.storage.local.get([key]).then(result => result[key])
}

export async function removeStorageItem(key) {
  return await chrome.storage.local.remove([key])
}

export function notify(title='notification', message) {
  chrome.runtime.sendMessage('', {
    type: 'notification',
    options: {
      title: title,
      message: message,
      iconUrl: 'https://hito.lampart-vn.com/static/imgs/favicon.ico',
      type: 'basic'
    }
  });
}

/**
 * @param {any} startTime
 * @param {any} callback
 */
export function addTimer(startTime, callback) {
  chrome.runtime.sendMessage('', {
    type: 'addTimer',
    data: {
      startTime: startTime,
      callback: callback
    }
  });
}