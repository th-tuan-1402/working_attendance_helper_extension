<script lang="ts" setup>
// Import components
import CredentialList from "@/pages/option/components/CredentialList.vue";
import CredentialDetail from "@/pages/option/components/CredentialDetail.vue";
import { computed, reactive, ref, onMounted } from "vue";

// App context
import AppContext from "@/scripts/lib/core/AppContext";
let appCtx = AppContext.getInstance();

// Persistent save
let useCredentialStore = appCtx.make("useCredentialStore");
let credentialStore = useCredentialStore();

// Vue hooks
let localStorage = appCtx.make("localStorage");
onMounted(async () => {
  const saveData = await localStorage.getItem("credentials");
  const credentials = saveData != null ? JSON.parse(saveData) : [];
  credentialStore.setCredentialList(credentials);
});

// Screen control
let screenControl = reactive({
  isShowRegistrationForm: false,
  isShowEditForm: false,
  isEditingUser: false,
  isModified: false,
});
let isShowEditForm = computed(() => screenControl.isShowEditForm);
let isShowRegistrationForm = computed(() => screenControl.isShowRegistrationForm);
let isShowCredentialList = computed(
  () => !isShowEditForm.value && !isShowRegistrationForm.value
);
let isShowCommandBtn = computed(() => isShowCredentialList.value);

//**********************************
//*         Event handlers         *
//**********************************
let targetCredential = ref<UserCredential | null | undefined>(null);
let onClickAddButton = () => {
  targetCredential.value = {
    userName: null,
    password: null,
    isAutoCheckIn: false,
    isAutoCheckOut: false,
    isAutoConfirmWorkingTime: false,
  };
  screenControl.isShowRegistrationForm = true;
};

const { addCredential } = credentialStore;
let onAddUser = (newCredential: UserCredential) => {
  addCredential(newCredential);
  screenControl.isShowRegistrationForm = false;
};

let { getCredentialById } = credentialStore;
let onEditUser = (index: number) => {
  targetCredential.value = getCredentialById(index);
  screenControl.isShowEditForm = true;
};

let onSaveUser = () => {
  targetCredential.value = null;
  screenControl.isShowEditForm = false;
};

let onCommitSave = async () => {
  if (typeof credentialStore.commit === "function") {
    await credentialStore.commit();
  }
};
</script>

<template>
  <div class="v-container credential-list-container">
    <!-- credential list -->
    <CredentialList
      v-if="isShowCredentialList"
      :isEditing="!isShowCredentialList"
      @updateUser="onEditUser"
    ></CredentialList>

    <!-- command button -->
    <v-card v-if="isShowCommandBtn" class="mt-1">
      <form action="#" class="p-2 flex justify-start">
        <button
          type="button"
          class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
          @click="onClickAddButton"
        >
          Add
        </button>
        <button
          type="button"
          class="focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          @click="onCommitSave"
        >
          Commit
        </button>
      </form>
    </v-card>

    <!-- registration form -->
    <CredentialDetail
      v-if="isShowRegistrationForm"
      class="mt-1"
      v-model="targetCredential"
      @update="onAddUser"
    ></CredentialDetail>

    <!-- edit form -->
    <CredentialDetail
      v-if="isShowEditForm"
      class="mt-1"
      v-model="targetCredential"
      @update="onSaveUser"
    ></CredentialDetail>
  </div>
</template>
<style scoped>
.credential-list-container {
  width: 43rem;
}
</style>
