import api from "./hitoApi";
import { getStorageItem, setStorageItem, removeStorageItem, notify } from "./ChromeApiHelper";

export async function login() {
  const username = await getStorageItem('username')
  const password = await getStorageItem('password')

  let params = {
    "username": username,
    "password": password,
    "locale": "vi",
    "remember": false
  } 
  
  let dataObj = await api.login(params)

  if (dataObj.success) {
    await setStorageItem({ 'apiToken': dataObj.data.token })
    console.warn('Token is refresh!!!');
  } else {
    notify("Error", dataObj.message)
  }
}

export async function loginKintai() {
  let dataObj = await api.loginKintai()

  if (dataObj.success) {
    await setStorageItem({ 'apiTokenKintai': dataObj.data.api_token })
    console.warn('kintai token is refresh!!!');
  } else {
    notify("Error", dataObj.message)
  }
}

export async function syncKintaiStatus() {
  let dataObj = await api.getKintaiStatus()

  if (dataObj.success) {
    const { checkin: canCheckIn, checkout: canCheckOut } = dataObj.data

    let saveItems = {
      isCheckedIn: !canCheckIn,
      isCheckedOut: !canCheckIn && !canCheckOut
    }

    await setStorageItem(saveItems)
  } else {
    notify("Error", dataObj.message)
  }
}

export async function checkin() {
  let params = {
    "type_log": 1,
    "latitude": 10.7872923,
    "longitude": 106.6852646
  }

  let dataObj = await api.changeKintaiStatus(params)
  console.warn(dataObj);

  if (dataObj.success) {
    // Set checkin timestamp
    await setStorageItem({ checkedInDatetime: (new Date()).toLocaleDateString() })

    // Notify
    notify('✅Notification', 'You have been checked in')
  } else {
    notify("Error", dataObj.message)
  }
}

export async function checkout() {
  let params = {
    "type_log": 2,
    "latitude": 10.7872923,
    "longitude": 106.6852646
  }

  let dataObj = await api.changeKintaiStatus(params)

  if (dataObj.success) {
    // Remove checkin timestamp
    removeStorageItem('checkInDatetime')

    // Notify
    notify('✅Notification', 'You have been checked out')
  } else {
    notify("Error", dataObj.message)
  }
}