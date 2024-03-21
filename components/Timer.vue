<script setup lang="ts">
import { ref } from "vue";
import DateTimeUtils from "@/scripts/lib/utils/DateTimeUtils";

setInterval(updateClockLabel, 1000);
let currentTime = ref("00:00:00");
// Update current time
function updateClockLabel() {
  currentTime.value = DateTimeUtils.getCurrentTimeAsString();
}
</script>
<template>
  <div>
    <div class="text-lg">
      {{ currentTime }}
    </div>
  </div>
</template>../scripts/lib/utils/DateTimeUtils
