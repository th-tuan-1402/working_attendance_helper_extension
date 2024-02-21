<script setup lang="ts">
import { onMounted, ref, reactive, computed } from "vue";
import ChangeStatusButton from "@/pages/popup/components/ChangeStatusButton.vue";
import Timer from "@/pages/popup/components/Timer.vue";
import commonConstants from "@/scripts/common/commonConstants";
import { default as api } from "@/scripts/api/hitoApi";

// Injection
import AppContext from "@/scripts/lib/core/AppContext";
import DateTimeUtils from '../../scripts/lib/utils/DateTimeUtils';
const appCtx = AppContext.getInstance();
let libs = appCtx.makeMany(["logger", "useCredentialStore", "chromeHelper"]);

const { logger, useCredentialStore, chromeHelper } = libs;
function error(message: string, err?: unknown) {
  logger.error(constants.TITLE_ERROR + " - " + message, err);
}
function warn(message: string, err?: unknown) {
  logger.error(constants.TITLE_WARNING + " - " + message, err);
}

// Screen control flags
let screenControl = reactive({
  isShowErrorMsg: false,
});

let constants = {
  URL_HITO_KINTAI: commonConstants.URL_HITO_KINTAI,
  // Error messages
  MSG_ERROR_SYNC_DATA: "Đồng bộ thất bại",
  MSG_ERROR_FAIL_ACTION: "Thao tác thất bại",

  // Push notification
  MSG_ERROR_FAIL_CHECKIN: "Fail to check in",
  MSG_ERROR_FAIL_CHECKOUT: "Fail to check out",
  MSG_INFO_SUCCESS_CHECKOUT: "You have been checked out",
  MSG_INFO_SUCCESS_CHECKIN: "You have been checked in",
  MSG_INFO_CONFIRM_BEFORE_CHECKOUT: "Đang trong thời gian làm việc, bạn chắc chứ!!!",
  MSG_ERROR_APPROVED_WORKING: "Fail to approve working time",
  TITLE_ERROR: "⛔Error",
  TITLE_WARNING: "⚠️Warning",
  TITLE_SUCCESS: "✅Notification",

  LOCALE: commonConstants.DEFAULT_LOCALE,
  LOCALE_LATITUDE: commonConstants.DEFAULT_LATITUDE,
  LOCALE_LONGITUDE: commonConstants.DEFAULT_LONGITUDE,
  TYPE_CHECKIN_CODE: 1,
  TYPE_CHECKOUT_CODE: 2,

  WORK_OFF_HOUR: 17,
};

// Error display handler
let isShowErrorMsg = computed(() => screenControl.isShowErrorMsg);
let errMsg = ref("");
function showErrorMessage(msg: string, timeout: number = 5000) {
  errMsg.value = msg;
  screenControl.isShowErrorMsg = true;
  setTimeout(() => (screenControl.isShowErrorMsg = false), timeout);
}

let credentialStore = useCredentialStore();
let users = computed(() => credentialStore.credentials);
let authenticatedUser = computed(() =>
  users.value.filter((item: UserCredential) => item.accessToken)
);
let isAuthenticated = computed(() => (user: UserCredential) => !!user.accessToken);
onMounted(async () => {
  // Restore credentials
  const saveData = await localStorage.getItem("credentials");
  let credentials = saveData != null ? JSON.parse(saveData) : [];
  credentialStore.setCredentialList(credentials);

  // Fectch kintai status
  users.value.forEach((element: UserCredential) => {
    fetchKintaiStatus(element, true);
  });
});

// Change kintai status button
let isShowChangeKintaiStatusBtn = computed(() => (user: UserCredential) =>
  isAuthenticated.value(user)
);

async function fetchKintaiStatus(credential: UserCredential, shouldRefreshToken = false) {
  let isSucceeded = true;
  if (shouldRefreshToken) {
    isSucceeded = await onRefreshToken(credential);
  }

  if (isSucceeded) {
    try {
      isSucceeded = await onSyncStatus(credential);
    } catch (err) {
      error(constants.MSG_ERROR_SYNC_DATA, err);
    }
  }

  return isSucceeded;
}

function notifySuccess(msg: string, url?: string) {
  chromeHelper.notify(constants.TITLE_SUCCESS, msg, url);
}
function notifyError(msg: string, url?: string) {
  chromeHelper.notify(constants.TITLE_ERROR, msg, url);
}

let isShowCredentialList = computed(() => credentialStore.credentials.length > 0);
//**********************************
//*         Event handlers         *
//**********************************
/**
 * Check in button handler
 */
async function onCheckIn(credential: UserCredential) {
  let isSucceeded = false;
  try {
    isSucceeded = await onRefreshToken(credential).then(() => checkIn(credential));
  } catch (e) {
    notifyError(constants.MSG_ERROR_FAIL_CHECKIN);
  }

  // Sync kintai status
  if (isSucceeded) {
    notifySuccess(constants.MSG_INFO_SUCCESS_CHECKIN, constants.URL_HITO_KINTAI);
    await fetchKintaiStatus(credential);
  }
}

let shouldCheckOut = computed(() => {
  const now = new Date();
  if (now.getHours() < constants.WORK_OFF_HOUR) {
    return false;
  }

  return true;
});

async function onCheckOut(credential: UserCredential) {
  if (shouldCheckOut && !confirm(constants.MSG_INFO_CONFIRM_BEFORE_CHECKOUT)) {
    return;
  }

  let isSucceeded = false;
  {
    try {
      isSucceeded = await onRefreshToken(credential).then(() => checkOut(credential));
    } catch (e) {
      notifyError(constants.MSG_ERROR_FAIL_CHECKOUT);
    }
  }

  // Sync kintai status
  if (isSucceeded) {
    notifySuccess(constants.MSG_INFO_SUCCESS_CHECKOUT, constants.URL_HITO_KINTAI);
    if (credential.isAutoConfirmWorkingTime) {
      await onApproveWorking(credential);
    }

    await fetchKintaiStatus(credential);
  }
}

/**
 * Refresh the token
 * @returns the token
 */
async function onRefreshToken(credential: UserCredential) {
  let isSucceeded = false;
  try {
    isSucceeded = await refreshToken(credential);
  } catch (err) {
    error(constants.MSG_ERROR_FAIL_ACTION, err);
  }

  return isSucceeded;
}

/**
 * Sync status
 */
async function onSyncStatus(credential: UserCredential) {
  let isSucceeded = false;
  try {
    let dataObj = await syncKintaiStatus(credential);
    isSucceeded = dataObj.success;
  } catch (err) {
    error(constants.MSG_ERROR_FAIL_ACTION, err);
  }

  return isSucceeded;
}

/**
 * Approve working event handler 
 */
async function onApproveWorking(credential: UserCredential) {
  let isSucceeded = false;
  try {
    isSucceeded = await approveWorking(credential)
  } catch (err) {
    warn(constants.MSG_ERROR_APPROVED_WORKING, err);
  }

  return isSucceeded;
}
//**********************************
//*    Common async function       *
//**********************************

async function refreshToken(credential: UserCredential) {
  let isSucceeded = false;

  console.log("start refresh token");
  {
    try {
      await login(credential);
      await loginKintai(credential);
      isSucceeded = true;
    } catch (err) {
      error(constants.MSG_ERROR_SYNC_DATA, err);
    }
  }
  console.log("end refresh token");

  return isSucceeded;
}

async function login(credential: UserCredential) {
  let params = {
    username: credential.userName,
    password: credential.password,
    locale: constants.LOCALE,
    remember: false,
  };

  let dataObj = await api.login(params);
  if (dataObj.success) {
    credential.accessToken = dataObj.data.token;
  }

  return dataObj;
}

async function loginKintai(credential: UserCredential) {
  let params = {
    locale: constants.LOCALE,
    token: credential.accessToken,
  };

  let dataObj = await api.loginKintai(params);
  if (dataObj.success) {
    credential.accessKintaiToken = dataObj.data.api_token;
    credential.userId = dataObj.data.id;
  }

  return dataObj;
}

async function syncKintaiStatus(credential: UserCredential) {
  let params = {
    accessToken: credential.accessKintaiToken,
  };

  let dataObj = await api.getKintaiStatus(params);
  if (dataObj.success) {
    const { checkin: canCheckIn, checkout: canCheckOut } = dataObj.data;
    credential.isCheckedIn = !canCheckIn;
    credential.isCheckedOut = !canCheckOut;
  }

  return dataObj;
}

/**
 * Check in asynchronously
 */
async function checkIn(credential: UserCredential) {
  let isSucceeded = false;

  try {
    let params = {
      type_log: constants.TYPE_CHECKIN_CODE,
      latitude: constants.LOCALE_LATITUDE,
      longitude: constants.LOCALE_LONGITUDE,
    };

    let dataObj = await api.changeKintaiStatus(params);
    if (dataObj.success) {
      credential.checkedInDatetime = new Date().toLocaleDateString();
    }

    isSucceeded = dataObj.success;
  } catch (err) {
    error(constants.MSG_ERROR_FAIL_ACTION, err);
  }

  return isSucceeded;
}

/**
 * Check out asynchronously
 */
async function checkOut(credential: UserCredential) {
  let isSucceeded = false;

  try {
    let params = {
      type_log: constants.TYPE_CHECKOUT_CODE,
      latitude: constants.LOCALE_LATITUDE,
      longitude: constants.LOCALE_LONGITUDE,
      accessToken: credential.accessKintaiToken,
    };

    let dataObj = await api.changeKintaiStatus(params);
    if (dataObj.success) {
      credential.checkedOutDatetime = new Date().toLocaleDateString();
    }

    isSucceeded = dataObj.success;
  } catch (err) {
    error(constants.MSG_ERROR_FAIL_ACTION, err);
  }

  return isSucceeded;
}

/**
 * Approve working asynchronously
 * @param credential
 */
async function approveWorking(credential: UserCredential) {
  let isSucceeded = false;

  try {
    let params = {
      date_log: DateTimeUtils.formatHyphen(DateTimeUtils.getCurrentDate()),
      employee_id: credential.userId,
      prev_time_log: null,
      button_status: "button_accept",
    };
    let dataObj = await api.approveWorking(params);
    isSucceeded = dataObj.success;
  } catch (err) {
    warn(constants.MSG_ERROR_APPROVED_WORKING, err);
  }

  return isSucceeded;
}
</script>
<template>
  <div class="popup-container p-1">
    <v-card>
      <form action="#">
        <div class="p-1 flex flex-col justify-center items-center">
          <v-card>
            <Timer class="py-1 px-2" />
          </v-card>
          <div v-if="isShowErrorMsg" class="text-red-300 mt-1">
            {{ errMsg }}
          </div>

          <v-card v-if="isShowCredentialList" class="w-100 mt-1">
            <div class="flex gap-y-1 flex-col items-enter py-2 px-4">
              <div
                v-for="(credential, index) in credentialStore.credentials"
                :key="index"
                class="flex gap-x-5 justify-center"
              >
                <div>
                  <v-icon size="small" icon="mdi-account"></v-icon>

                  {{ credential.userName }}
                </div>
                <ChangeStatusButton
                  v-if="isShowChangeKintaiStatusBtn(credential)"
                  v-model="credentialStore.credentials[index]"
                  @onCheckIn="onCheckIn(credential)"
                  @onCheckOut="onCheckOut(credential)"
                >
                </ChangeStatusButton>
                <div v-if="!isAuthenticated(credential)">
                  <v-tooltip :text="constants.MSG_ERROR_SYNC_DATA">
                    <template v-slot:activator="{ props }">
                      <v-icon size="small" icon="mdi-alert-circle" class="text-red-800">
                      </v-icon>
                    </template>
                  </v-tooltip>
                </div>
              </div>
            </div>
          </v-card>
        </div>
      </form>
    </v-card>
  </div>
</template>
<style scoped>
.popup-container {
  width: 11rem;
}
</style>
