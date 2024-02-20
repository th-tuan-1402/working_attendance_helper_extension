<script lang="ts" setup>
import { computed, reactive } from "vue";

// Declare props
let props = defineProps({
  isEditing: {
    type: Boolean,
    required: true,
  },
});

// Declare event
const emit = defineEmits<{
  (e: "updateUser", selectedIndex: number): void;
  (e: "deleteUser", selectedIndex: number): void;
}>();

// stores
import { useCredentialStore } from "@/store/credential";
import { storeToRefs } from "pinia";
let credentialStore = useCredentialStore();
let { credentials, isEmptyCredential } = storeToRefs(credentialStore);

let checkedIcon = computed(() => {
  return function (checked: boolean) {
    return checked ? "✅" : "❌";
  };
});
let isShowContent = computed(() => !isEmptyCredential.value);
let isShowActionBtn = computed(() => !props.isEditing);

// Event handlerss
let onEditUser = (index: number) => {
  emit("updateUser", index);
};
const { deleteCredentialByIndex } = credentialStore;
let onDeleteUser = (index: number) => {
  deleteCredentialByIndex(index);
  emit("deleteUser", index);
};
</script>
<template>
  <v-card>
    <v-card-text v-if="isShowContent">
      <v-table density="compact">
        <thead>
          <th class="text-right">#</th>
          <th class="text-center">User</th>
          <th class="text-center">Auto Checkin</th>
          <th class="text-center">Auto Checkout</th>
          <th class="text-center">Confirm Woring Date</th>
          <th class="text-right">Action</th>
        </thead>
        <tbody>
          <tr v-for="(info, index) in credentials" :key="index">
            <td class="text-right">{{ index + 1 }}</td>
            <td class="text-center">{{ info.userName }}</td>
            <td class="text-center">{{ checkedIcon(info.isAutoCheckIn) }}</td>
            <td class="text-center">{{ checkedIcon(info.isAutoCheckOut) }}</td>
            <td class="text-center">
              {{ checkedIcon(info.isAutoConfirmWorkingTime) }}
            </td>
            <td class="flex justify-end">
              <button
                v-show="isShowActionBtn"
                class="ml-2 px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                @click="onEditUser(index)"
                type="button"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-6 h-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                  />
                </svg>
              </button>
              <button
                v-show="isShowActionBtn"
                class="ml-2 px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                @click="onDeleteUser(index)"
                type="button"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-6 h-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                  />
                </svg>
              </button>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card-text>
    <v-card-text v-else class="flex justify-center">No Data</v-card-text>
  </v-card>
</template>
