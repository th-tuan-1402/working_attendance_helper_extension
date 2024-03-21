<script lang="ts" setup>
let model = defineModel({ type: Object });

// Declare event
let emit = defineEmits<{
  (e: "update", credential: UserCredential): void;
}>();

// stores
import { computed } from "vue";
let isShowContent = computed(() => model.value != null);
let onSaveUser = () => {
  emit("update", model.value);
};
</script>
<template>
  <form action="#" v-if="isShowContent">
    <v-text-field
      v-model="model.userName"
      label="User name"
      placeholder="LPXXX"
      required
    />
    <v-text-field
      v-model="model.password"
      label="Password"
      placeholder="•••••••••"
      required
      type="password"
    />
    <v-checkbox
      v-model="model.isAutoCheckIn"
      density="compact"
      label="Auto checkin"
      type="checkbox"
      value="1"
    ></v-checkbox>
    <v-checkbox
      v-model="model.isAutoCheckOut"
      density="compact"
      label="Auto checkout"
      type="checkbox"
      value="1"
    ></v-checkbox>
    <div v-if="model.isAutoCheckOut" class="mb-4 ml-5 flex items-center">
      <v-checkbox
        v-model="model.isAutoConfirmWorkingTime"
        density="compact"
        label="Confirm working time"
        type="checkbox"
        value="1"
      ></v-checkbox>
    </div>
    <v-btn color="primary" @click="onSaveUser"> Save </v-btn>
  </form>
</template>
<style lang="scss" scope>
.v-checkbox .v-selection-control {
  min-height: 30px;
}
</style>