import { getStorageItem, setStorageItem, notify } from "../helpers/ChromeHelper";

export default class HitoController {
  constructor(api) {
    this.api = api;
  }

  async loop() {
    const HTIO_KINTAI_URL = "https://kintai-hito.lampart-vn.com/timestamp";
    let now = new Date()

    if (await this.shouldCheckIn(now)) {
      try {
        await this.refreshToken()

        // Check in
        await this.checkIn()
          .then(dataObj => {
            if (dataObj.success) {
              // Notify
              notify('✅Notification', 'You have been checked in', HTIO_KINTAI_URL)
            }
          })

        await this.syncKintaiStatus()
      } catch (e) {

      }

      // Get kintai status
    } else if (await this.shouldCheckOut(now)) {
      try {
        await this.refreshToken()

        // Check out
        await this.checkOut()
          .then(dataObj => {
            if (dataObj.success) {
              // Notify
              notify('✅Notification', 'You have been checked out', HTIO_KINTAI_URL)
            }
          })

        await this.syncKintaiStatus()
      } catch (e) {

      }
    }
  }

  async login() {
    const username = await getStorageItem('username')
    const password = await getStorageItem('password')

    let params = {
      "username": username,
      "password": password,
      "locale": "vi",
      "remember": false
    }

    let dataObj = await this.api.login(params)

    if (dataObj.success) {
      console.log('Token is refresh!!!');
      await setStorageItem({ 'apiToken': dataObj.data.token })
    } else {
      console.error("Error", dataObj.message)
    }

    return dataObj
  }

  async loginKintai() {
    let dataObj = await this.api.loginKintai()

    if (dataObj.success) {
      await setStorageItem({ 'apiTokenKintai': dataObj.data.api_token })
      console.log('kintai token is refresh!!!');
    } else {
      console.error("Error", dataObj.message)
    }

    return dataObj
  }

  async syncKintaiStatus() {
    let dataObj = await this.api.getKintaiStatus()

    if (dataObj.success) {
      const { checkin: canCheckIn, checkout: canCheckOut } = dataObj.data

      let saveItems = {
        isCheckedIn: !canCheckIn,
        isCheckedOut: !canCheckIn && !canCheckOut
      }

      await setStorageItem(saveItems)
    } else {
      console.log("Error", dataObj.message)
    }

    return dataObj
  }

  async checkIn() {
    let params = {
      "type_log": 1,
      "latitude": 10.7872923,
      "longitude": 106.6852646
    }

    let dataObj = await this.api.changeKintaiStatus(params)

    if (dataObj.success) {
      // Set checkin timestamp
      await setStorageItem({ checkedInDatetime: (new Date()).toLocaleDateString() })
    } else {
      console.error("Error", dataObj.message)
    }

    return dataObj
  }

  async checkOut() {
    let params = {
      "type_log": 2,
      "latitude": 10.7872923,
      "longitude": 106.6852646
    }

    let dataObj = await this.api.changeKintaiStatus(params)

    if (dataObj.success) {
      // Save checkout timestamp
      await setStorageItem({ checkedOutDatetime: (new Date()).toLocaleDateString() })
    } else {
      console.error("Error", dataObj.message)
    }

    return dataObj
  }

  async refreshToken() {
    console.log('start refresh token');

    await this.login()
    await this.loginKintai()

    console.log('end refresh token');
  }

  /**
 * Should check in
 * @param {Date} now 
 * @returns 
 */
  async shouldCheckIn(now) {
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
  async shouldCheckOut(now) {
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
}