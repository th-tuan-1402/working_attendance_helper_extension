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
      <v-table>
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
            <td>
              <v-btn
                v-show="isShowActionBtn"
                color="blue"
                variant="plain"
                icon="mdi:mdi-square-edit-outline"
                class="text-sm font-medium"
                @click="onEditUser(index)"
              >
              </v-btn>
              <v-btn
                v-show="isShowActionBtn"
                color="red"
                variant="plain"
                icon="mdi:mdi-trash-can"
                class="text-sm font-medium"
                @click="onDeleteUser(index)"
              >
              </v-btn>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card-text>
    <v-card-text v-else class="flex justify-center">No Data</v-card-text>
  </v-card>
</template>
