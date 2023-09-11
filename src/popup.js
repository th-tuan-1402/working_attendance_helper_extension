import { checkin, checkout, refreshToken, syncKintaiStatus } from './hitoCommonApi';
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

  const timeLabel = document.getElementById('timeLabel')
  setInterval(() => {
    let now = new Date()
    timeLabel.innerText = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds()
  }, 1000)

  try {
    await refreshToken()
    await syncKintaiStatus()

    // Set change kintai status
    const isCheckedIn = await getStorageItem('isCheckedIn')
    const isCheckedOut = await getStorageItem('isCheckedOut')
    console.warn('checked in: ', isCheckedIn, ' checked out: ', isCheckedOut);

    const btnChangeStatus = document.getElementById('btnChangeStatus')
    btnChangeStatus?.classList.toggle('hidden')

    if (!isCheckedIn) {
      btnChangeStatus.innerText = 'Check in'
      btnChangeStatus.addEventListener('click', onCheckIn)
    } else if (!isCheckedOut) {
      btnChangeStatus.innerText = 'Check out'
      btnChangeStatus.addEventListener('click', onCheckOut)
    } else {
      btnChangeStatus.setAttribute('disabled', 'disabled')
      btnChangeStatus?.classList.add('bg-gray-300', 'focus:outline-none')
      btnChangeStatus?.classList.remove('bg-green-500')
    }
  } catch(e) {
    const errMsg = document.getElementById('errMsg')
    errMsg.innerText = "⛔Đồng bộ thất bại"
    errMsg.classList.remove('hidden')
  }
})();

async function onCheckIn() {
  try {
    await refreshToken()

    await checkin()
      .then(dataObj => {
        if (dataObj.success) {
          // Notify
          notify('✅Notification', 'You have been checked in')
        } else {
          notify('⛔Error', 'Fail to check in')
        }
      })
  } catch(e) {
    // Notify
    notify('⛔Error', 'Fail to check in')
  }

  // Sync kintai status
  try {
    await syncKintaiStatus()
  } catch (error) {
    // Ignore error
  }
}

async function onCheckOut() {
  const now = new Date()

  if (now.getHours() < 17) {
    if (confirm('Đang trong thời gian làm việc, bạn chắc chứ!!!')) {
      try {
        await refreshToken()

        await checkout()
          .then(dataObj => {
            if (dataObj.success) {
              // Notify
              notify('✅Notification', 'You have been checked out')
            } else {
              notify('⛔Error', 'Fail to check out')
            }
          })
      } catch(e) {
        // Notify
        notify('⛔Error', 'Fail to check out')
      }

      // Sync kintai status
      try {
        await syncKintaiStatus()
      } catch (error) {
        // Ignore error
      }
    }
  }
}