import { checkin, checkout, login, loginKintai } from './hitoCommonApi';
import { getStorageItem, notify } from './ChromeApiHelper';

// The async IIFE is necessary because Chrome <89 does not support top level await.
(async function initPopupWindow() {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (tab?.url) {
    try {
      let url = new URL(tab.url);
      input.value = url.hostname;
    } catch {
      // ignore
    }
  }

  // Set change kintai status
  const isCheckedIn = await getStorageItem('isCheckedIn')
  const isCheckedOut = await getStorageItem('isCheckedOut')

  const timeLabel = document.getElementById('timeLabel')
  setInterval(() => {
    let now = new Date()
    timeLabel.innerText = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds()
  }, 1000)

  const btnChangeStatus = document.getElementById('btnChangeStatus')
  if (!isCheckedIn) {
    btnChangeStatus.innerText = 'Check in'
    btnChangeStatus.addEventListener('click', checkInHandler)
  } else if (!isCheckedOut) {
    btnChangeStatus.innerText = 'Check out'
    btnChangeStatus.addEventListener('click', checkOutHandler)
  } else {
    btnChangeStatus.setAttribute('disabled', 'disabled')
  }
})();

async function checkInHandler() {
  await login()

  await loginKintai()

  await checkin()
    .then(dataObj => {
      if (dataObj.success) {
        // Notify
        notify('✅Notification', 'You have been checked in')
      }
    })
}

async function checkOutHandler() {
  const now = new Date()

  if (now.getHours() < 17) {
    if (confirm('Đang trong thời gian làm việc, bạn chắc chứ!!!')) {
      await login()

      await loginKintai()

      await checkout()
        .then(dataObj => {
          if (dataObj.success) {
            // Notify
            notify('✅Notification', 'You have been checked out')
          }
        })
    }
  }
}