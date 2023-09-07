import { login, loginKintai, checkin, checkout, syncKintaiStatus } from './hitoCommonApi'
import { getStorageItem, notify } from './ChromeApiHelper';

(async function () {
  let now = new Date()
  await syncKintaiStatus()

  if (await shouldCheckIn(now)) {
    await login()
    await loginKintai()

    // Check in
    await checkin()
    .then(dataObj => {
      if (dataObj.success) {
          // Notify
          notify('✅Notification', 'You have been checked in')
      }
    })

  // Get kintai status
  } else if (await shouldCheckOut(now)) {
    await login()
    await loginKintai()

    // Check out
    checkout()
    .then(dataObj => {
      if (dataObj.success) {
          // Notify
          notify('✅Notification', 'You have been checked out')
      }
    })
  }
})()

/**
 * Should check in
 * @param {Date} now 
 * @returns 
 */
async function shouldCheckIn(now) {
  const isAutoCheckIn = await getStorageItem('isAutoCheckIn')
  if (!isAutoCheckIn) {
    return false
  }

  // Checked in mark timestamp for reduce api call
  let checkedInDatetime = await getStorageItem('checkedInDatetime')
  if (checkedInDatetime && checkedInDatetime === now.toLocaleDateString()) {
    return false
  }

  // For first installation, call api further to check kintai status
  if (now.getHours() == 7 && now.getMinutes() <= 30) {
    return false
  }

  // Whether it can check in
  const canCheckIn = await getStorageItem('isCheckedIn')
  if (!canCheckIn) {
    return false
  }

  return true
}

async function shouldCheckOut(now) {
  const isAutoCheckOut = await getStorageItem('isAutoCheckOut')
  if (!isAutoCheckOut) {
    return false
  }

  if (now.getHours() < 17) {
    return false
  }

  // Whether it can check in
  const canCheckOut = await getStorageItem('isCheckedOut')
  if (!canCheckOut) {
    return false
  }

  return true
}