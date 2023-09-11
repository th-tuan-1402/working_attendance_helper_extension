import { refreshToken, checkin, checkout, syncKintaiStatus } from './hitoCommonApi'
import { getStorageItem, notify } from './ChromeApiHelper';

(async function () {
  let now = new Date()

  if (await shouldCheckIn(now)) {
    try {
      await refreshToken()

      // Check in
      await checkin()
        .then(dataObj => {
          if (dataObj.success) {
            // Notify
            notify('✅Notification', 'You have been checked in')
          }
        })

      await syncKintaiStatus()
    } catch (e) {

    }

    // Get kintai status
  } else if (await shouldCheckOut(now)) {
    try {
      await refreshToken()

      // Check out
      await checkout()
        .then(dataObj => {
          if (dataObj.success) {
            // Notify
            notify('✅Notification', 'You have been checked out')
          }
        })

      await syncKintaiStatus()
    } catch (e) {

    }
  }
})()

/**
 * Should check in
 * @param {Date} now 
 * @returns 
 */
async function shouldCheckIn(now) {
  const isAutoCheckIn = await getStorageItem('isAutoCheckIn')
  if (isAutoCheckIn == false) {
    return false
  }

  // Checked in mark timestamp for reduce api call
  let checkedInDatetime = await getStorageItem('checkedInDatetime')
  if (checkedInDatetime && checkedInDatetime === now.toLocaleDateString()) {
    return false
  }

  // Whether it can check in
  const isCheckedIn = await getStorageItem('isCheckedIn')
  if (isCheckedIn == true) {
    return false
  }

  // For first installation, call api further to check kintai status
  if (now.getHours() == 7 && now.getMinutes() <= 30) {
    return false
  }

  return true
}

/**
 * Should check out
 * @param {Date} now 
 * @returns 
 */
async function shouldCheckOut(now) {
  const isAutoCheckOut = await getStorageItem('isAutoCheckOut')
  if (isAutoCheckOut == false) {
    return false
  }

  // Checked in mark timestamp for reduce api call
  let checkedOutDatetime = await getStorageItem('checkedOutDatetime')
  if (checkedOutDatetime && checkedOutDatetime === now.toLocaleDateString()) {
    return false
  }

  if (now.getHours() < 17) {
    return false
  }

  // Whether it can check in
  const isCheckedOut = await getStorageItem('isCheckedOut')
  if (isCheckedOut == true) {
    return false
  }

  return true
}