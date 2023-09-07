import api from "./hitoApi";
import { getStorageItem, setStorageItem, removeStorageItem } from "./ChromeApiHelper";

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
    console.log('Token is refresh!!!');
    await setStorageItem({ 'apiToken': dataObj.data.token })
  } else {
    console.error("Error", dataObj.message)
  }

  return dataObj
}

export async function loginKintai() {
  let dataObj = await api.loginKintai()

  if (dataObj.success) {
    await setStorageItem({ 'apiTokenKintai': dataObj.data.api_token })
    console.log('kintai token is refresh!!!');
  } else {
    console.error("Error", dataObj.message)
  }

  return dataObj
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
    console.log("Error", dataObj.message)
  }

  return dataObj
}

export async function checkin() {
  let params = {
    "type_log": 1,
    "latitude": 10.7872923,
    "longitude": 106.6852646
  }

  let dataObj = await api.changeKintaiStatus(params)
  console.log(dataObj);

  if (dataObj.success) {
    // Set checkin timestamp
    await setStorageItem({ checkedInDatetime: (new Date()).toLocaleDateString() })
  } else {
    console.error("Error", dataObj.message)
  }

  return dataObj
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
  } else {
    console.error("Error", dataObj.message)
  }

  return dataObj
}

export async function refreshToken() {
  console.log('start refresh token');
  
  let {success} = await login()
  if (success) {
    return await loginKintai()
  }

  console.log('end refresh token');
  return false
}