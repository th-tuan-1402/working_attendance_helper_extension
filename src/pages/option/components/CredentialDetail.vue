<script lang="ts" setup>
let model = defineModel({ type: Object });

// Declare event
let emit = defineEmits<{
  (e: "update", credential: UserCredential): void;
}>();

// stores
import { computed } from "vue";
import { UserCredential } from "@/types/global";
let isShowContent = computed(() => model.value != null);
let onSaveUser = () => {
  emit("update", model.value);
};
</script>
<template>
  <v-card v-if="isShowContent">
    <v-card-text>
      <form action="#" class="p-2">
        <div class="mb-6">
          <label
            for="username"
            class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >User name</label
          >
          <input
            v-model="model.userName"
            type="username"
            id="username"
            class="form_input block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            placeholder="LPXXX"
            required
          />
        </div>
        <div class="mb-6">
          <label
            for="password"
            class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >Password</label
          >
          <input
            v-model="model.password"
            type="password"
            id="password"
            class="form_input block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            placeholder="•••••••••"
            required
          />
        </div>
        <div class="mb-4 flex items-center">
          <input
            v-model="model.isAutoCheckIn"
            id="isAutoCheckIn"
            type="checkbox"
            value="1"
            class="form_input h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
          />
          <label
            for="isAutoCheckIn"
            class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >Auto checkin</label
          >
        </div>
        <div class="mb-4 flex items-center">
          <input
            v-model="model.isAutoCheckOut"
            id="isAutoCheckOut"
            type="checkbox"
            value="1"
            class="form_input h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
          />
          <label
            for="isAutoCheckOut"
            class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >Auto checkout</label
          >
        </div>
        <div v-if="model.isAutoCheckOut" class="mb-4 ml-5 flex items-center">
          <input
            v-model="model.isAutoConfirmWorkingTime"
            id="isAutoConfirmWorkingTime"
            type="checkbox"
            value="1"
            class="form_input h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
          />
          <label
            for="isAutoConfirmWorkingTime"
            class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >Confirm working time</label
          >
        </div>
        <button
          type="button"
          class="px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          @click="onSaveUser"
        >
          Save
        </button>
      </form>
    </v-card-text>
  </v-card>
</template>
