<script setup lang="ts">
import { defineModel, reactive, computed } from "vue";

let emit = defineEmits<{
  (e: "onCheckIn", credential: UserCredential): void;
  (e: "onCheckOut", credential: UserCredential): void;
}>();

const constants = reactive({
  KINTAI_WORKING_STATUS_CODE: 1,
  KINTAI_CHECKIN_STATUS_CODE: 2,
  KINTAI_CHECKOUT_STATUS_CODE: 3,
  KINTAI_CHECKIN_ICON: "mdi:mdi-login",
  KINTAI_CHECKOUT_ICON: "mdi:mdi-logout",
});

let model = defineModel({ type: Object });
let classChangeStatusBtn = computed(() => {
  let classes = "text-gray-800";

  if (canCheckIn.value) {
    classes = "text-green-800";
  } else if (canCheckOut.value) {
    classes = "text-red-800";
  }

  return classes;
});

let canCheckIn = computed(() => !model.value.isCheckedIn);
let canCheckOut = computed(() => !model.value.isCheckedOut);
let statusIcon = computed(() => {
  if (canCheckIn.value) {
    return constants.KINTAI_CHECKIN_ICON;
  } else if (canCheckOut.value) {
    return constants.KINTAI_CHECKOUT_ICON;
  }
});
let isShowBtn = computed(() => canCheckIn || canCheckOut);

// Event handlers
function onClickBtn() {
  if (canCheckIn.value) {
    emit("onCheckIn", model.value);
  } else if (canCheckOut.value) {
    emit("onCheckOut", model.value);
  }
}
</script>
<template>
  <button v-if="isShowBtn" type="button" @click="onClickBtn">
    <v-icon size="small" :icon="statusIcon" :class="classChangeStatusBtn"></v-icon>
  </button>
</template>
