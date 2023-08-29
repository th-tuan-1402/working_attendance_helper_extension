import { login, loginKintai, checkin, checkout, syncKintaiStatus } from './static/hitoCommonApi'
import { getStorageItem } from './static/ChromeApiHelper';

(async function () {
  let now = new Date()

  if (await shouldCheckIn(now)) {
    await login()
    await loginKintai()

    // Check in
    await checkin()

    // Get kintai status
    await syncKintaiStatus()
  } else if (now.getHours() >= 17) {
    await login()
    await loginKintai()

    checkout()
  }
})()

async function shouldCheckIn(now) {
  let checkedInDatetime = await getStorageItem('checkedInDatetime')

  if (checkedInDatetime && checkedInDatetime === now.toLocaleDateString()) {
    return false
  }

  if (now.getHours() == 8 && now.getMinutes() <= 30) {
    return false
  }

  return true
}