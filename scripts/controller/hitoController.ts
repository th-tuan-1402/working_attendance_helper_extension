import AppContext from '@/scripts/lib/core/AppContext'
import commonConstants from '@/scripts/common/commonConstants'
import DateTimeUtils from '@/scripts/lib/utils/DateTimeUtils'

// Injections
let appCtx = AppContext.getInstance()
const services = ['chromeHelper', 'logger', 'hitoApi', 'localStorage']
const { chromeHelper, logger, hitoApi: api, localStorage } = appCtx.makeMany(services)

let constants = {
  // Error messages
  MSG_ERROR_SYNC_DATA: 'Đồng bộ thất bại',
  MSG_ERROR_FAIL_ACTION: 'Thao tác thất bại',

  // Push notification
  MSG_ERROR_FAIL_CHECKIN: 'Fail to check in',
  MSG_ERROR_FAIL_CHECKOUT: 'Fail to check out',
  MSG_INFO_SUCCESS_CHECKOUT: 'You have been checked out',
  MSG_INFO_SUCCESS_CHECKIN: 'You have been checked in',
  MSG_INFO_CONFIRM_BEFORE_CHECKOUT: 'Đang trong thời gian làm việc, bạn chắc chứ!!!',
  MSG_ERROR_APPROVED_WORKING: 'Fail to approve working time',
  TITLE_ERROR: '⛔Error',
  TITLE_WARNING: '⚠️Warning',
  TITLE_SUCCESS: '✅Notification',

  LOCALE: commonConstants.DEFAULT_LOCALE,
  LOCALE_LATITUDE: commonConstants.DEFAULT_LATITUDE,
  LOCALE_LONGITUDE: commonConstants.DEFAULT_LONGITUDE,
  TYPE_CHECKIN_CODE: 1,
  TYPE_CHECKOUT_CODE: 2,

  WORK_OFF_HOUR: 17,
  WORK_OFF_MINUTE: 1,
  WORK_ON_HOUR: 7,
  WORK_ON_MINUTE: 30,
  URL_HITO_KINTAI: commonConstants.URL_HITO_KINTAI,

  STATUS_APPROVE_WORKING_BUTTON: 'button_accept'
}

/**
 * Log error message
 * @param message
 * @param err
 */
function error(message: string, err?: unknown) {
  logger.error(constants.TITLE_ERROR + ' - ' + message, err)
}
function warn(message: string, err?: unknown) {
  logger.error(constants.TITLE_WARNING + ' - ' + message, err)
}
function notifySuccess(msg: string, options?: string) {
  chromeHelper.notify(constants.TITLE_SUCCESS, msg)
}
function notifyError(msg: string, options?: string) {
  chromeHelper.notify(constants.TITLE_ERROR, msg)
}
function notifyWarning(msg: string, options?: string) {
  chromeHelper.notify(constants.TITLE_WARNING, msg)
}

/**
* Should check in
* @param now
* @param credential
* @returns
*/
function shouldCheckIn(now, credential: UserCredential): boolean {
  if (credential.isAutoCheckIn == false) {
    return false
  }

  // Whether it can check in
  if (credential.isCheckedIn == true) {
    return false
  }

  // For first installation, call api further to check kintai status
  if (now.getHours() == constants.WORK_ON_HOUR && now.getMinutes() <= constants.WORK_ON_MINUTE) {
    return false
  }

  return true
}

/**
 * Should check out
 * @param now
 * @param credential
 * @returns
 */
function shouldCheckOut(now, credential: UserCredential): boolean {
  if (credential.isAutoCheckOut == false) {
    return false
  }

  if (now.getHours() < constants.WORK_OFF_HOUR) {
    return false
  } else if (now.getHours() == constants.WORK_OFF_HOUR && now.getMinutes() < constants.WORK_OFF_MINUTE) {
    return false
  }

  // Whether it can check in
  if (credential.isCheckedOut == true) {
    return false
  }

  return true
}

//**********************************
//*        Event Handlers          *
//**********************************
/**
 * Check in button handler
 */
async function onCheckIn(credential: UserCredential) {
  let isSucceeded = false
  try {
    isSucceeded = await checkIn(credential);
  } catch (e) {
    notifyError(constants.MSG_ERROR_FAIL_CHECKIN)
  }

  // Sync kintai status
  if (isSucceeded) {
    notifySuccess(constants.MSG_INFO_SUCCESS_CHECKIN, constants.URL_HITO_KINTAI)
    await fetchKintaiStatus(credential)
  }
}

async function onCheckOut(credential: UserCredential): Promise<void> {
  let isSucceeded = false
  {
    try {
      isSucceeded = await checkOut(credential)
    } catch (e) {
      notifyError(constants.MSG_ERROR_FAIL_CHECKOUT)
    }
  }

  // Sync kintai status
  if (isSucceeded) {
    notifySuccess(constants.MSG_INFO_SUCCESS_CHECKOUT, constants.URL_HITO_KINTAI)
    if (credential.isAutoConfirmWorkingTime) {
      await onApproveWorking(credential)
    }

    await fetchKintaiStatus(credential)
  }
}

/**
 * Refresh the token
 * @returns the token
 */
async function onRefreshToken(credential: UserCredential) {
  let isSucceeded = false
  try {
    isSucceeded = await refreshToken(credential)
  } catch (err) {
    error(constants.MSG_ERROR_FAIL_ACTION, err)
  }

  return isSucceeded
}

/**
 * Sync status
 */
async function onSyncStatus(credential: UserCredential) {
  let isSucceeded = false
  try {
    let dataObj = await syncKintaiStatus(credential)
    isSucceeded = dataObj.success
  } catch (err) {
    error(constants.MSG_ERROR_FAIL_ACTION, err)
  }

  return isSucceeded
}

/**
 * Approve working event handler
 */
async function onApproveWorking(credential: UserCredential) {
  let isSucceeded = false
  try {
    isSucceeded = await approveWorking(credential)
  } catch (err) {
    notifyWarning(constants.MSG_ERROR_APPROVED_WORKING)
  }

  return isSucceeded
}
//**********************************
//*    Common async function       *
//**********************************
async function checkKintaiToken(credential: UserCredential) {
  let isSucceeded = true;

  try {
    let params = {
      accessToken: credential.accessKintaiToken,
    };
    isSucceeded = (await api.checkKintaiToken(params)).success;
  } catch (err) {
    error(constants.MSG_ERROR_SYNC_DATA, err);
  }

  return isSucceeded;
}

async function refreshToken(credential: UserCredential) {
  let isSucceeded = false

  console.log('start refresh token')
  {
    try {
      await login(credential)
      await loginKintai(credential)
      isSucceeded = true
    } catch (err) {
      error(constants.MSG_ERROR_SYNC_DATA, err)
    }
  }
  console.log('end refresh token')

  return isSucceeded
}

async function login(credential: UserCredential) {
  let params = {
    username: credential.userName,
    password: credential.password,
    locale: constants.LOCALE,
    remember: false
  }

  let dataObj = await api.login(params)
  if (dataObj.success) {
    credential.accessToken = dataObj.data.token
  }

  return dataObj
}

async function loginKintai(credential: UserCredential) {
  let params = {
    locale: constants.LOCALE,
    token: credential.accessToken
  }

  let dataObj = await api.loginKintai(params)
  if (dataObj.success) {
    credential.accessKintaiToken = dataObj.data.api_token
  }

  return dataObj
}

async function syncKintaiStatus(credential: UserCredential) {
  let params = {
    accessToken: credential.accessKintaiToken
  }

  let dataObj = await api.getKintaiStatus(params)
  if (dataObj.success) {
    const { checkin: canCheckIn, checkout: canCheckOut } = dataObj.data
    credential.isCheckedIn = !canCheckIn
    credential.isCheckedOut = !canCheckOut
  }

  return dataObj
}

/**
 * Check in asynchronously
 */
async function checkIn(credential: UserCredential) {
  let isSucceeded = false

  try {
    let params = {
      type_log: constants.TYPE_CHECKIN_CODE,
      latitude: constants.LOCALE_LATITUDE,
      longitude: constants.LOCALE_LONGITUDE,
      accessToken: credential.accessKintaiToken,
    }

    let dataObj = await api.changeKintaiStatus(params)

    isSucceeded = dataObj.success
  } catch (err) {
    error(constants.MSG_ERROR_FAIL_ACTION, err)
  }

  return isSucceeded
}

async function fetchKintaiStatus(credential: UserCredential, shouldRefreshToken = false) {
  let isSucceeded = true
  if (shouldRefreshToken) {
    isSucceeded = await onRefreshToken(credential)
  }

  if (isSucceeded) {
    try {
      isSucceeded = await onSyncStatus(credential)
    } catch (err) {
      error(constants.MSG_ERROR_SYNC_DATA, err)
    }
  }

  return isSucceeded
}

/**
 * Check out asynchronously
 */
async function checkOut(credential: UserCredential) {
  let isSucceeded = false

  try {
    let params = {
      type_log: constants.TYPE_CHECKOUT_CODE,
      latitude: constants.LOCALE_LATITUDE,
      longitude: constants.LOCALE_LONGITUDE,
      accessToken: credential.accessKintaiToken
    }

    let dataObj = await api.changeKintaiStatus(params)
    isSucceeded = dataObj.success
  } catch (err) {
    error(constants.MSG_ERROR_FAIL_ACTION, err)
  }

  return isSucceeded
}

/**
 * Approve working asynchronously
 * @param credential
 */
async function approveWorking(credential: UserCredential) {
  let isSucceeded = false

  try {
    let params = {
      date_log: DateTimeUtils.formatHyphen(DateTimeUtils.getCurrentDate()),
      employee_id: credential.userId,
      prev_time_log: null,
      button_status: constants.STATUS_APPROVE_WORKING_BUTTON,
      accessToken: credential.accessKintaiToken,
    }
    let dataObj = await api.approveWorking(params)
    isSucceeded = dataObj.success
  } catch (err) {
    warn(constants.MSG_ERROR_APPROVED_WORKING, err)
  }

  return isSucceeded
}

/**
 * Loops through the credentials stored in local storage and performs various actions based on the current time and the status of each credential.
 *
 * @return {Promise<void>} A promise that resolves when the function has finished executing.
 */
export async function loop() {
  const now = new Date()

  // Credentials store
  let credentials = (await localStorage.getArray("credentials")) ?? [];

  credentials.forEach(async (credential) => {
    if (!(await checkKintaiToken(credential))) {
      await onRefreshToken(credential);
    }
    await onSyncStatus(credential);

    if (shouldCheckIn(now, credential)) {
      await onCheckIn(credential)
    }
    else if (shouldCheckOut(now, credential)) {
      await onCheckOut(credential)
    }
  })
}

/**
 * Change the status of Kintai within a specified time range.
 *
 * @return {Promise<void>} - A promise that resolves when the function completes.
 */
export async function changeKintaiStatusWithinTime() {
  const now = new Date()

  // Credentials store
  let credentials = (await localStorage.getArray("credentials")) ?? [];

  credentials.forEach(async (credential) => {
    if (shouldCheckIn(now, credential)) {
      await onCheckIn(credential)
    }
    else if (shouldCheckOut(now, credential)) {
      await onCheckOut(credential)
    }
  })
}
