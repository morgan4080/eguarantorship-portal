<script setup lang="ts">
import TheNavBar from './components/TheNavBar.vue'
import TheFooter from './components/TheFooter.vue'
import TheSideBar from './components/TheSideBar.vue'
import Notification from './components/Notification.vue'
import mainStore from "./utils/store"
import { computed } from "vue"
const notification = computed(() => {
  // store.getters.getNotification

  return mainStore.getNotification
})
</script>

<template>
  <TheNavBar class="fixed w-screen" />
  <div class="flex min-h-screen" >
    <TheSideBar v-if="$route.name !== 'Landing' && $route.name !== 'Password-Reset'" />
    <router-view></router-view>
    <Notification v-if="notification.message" :success="notification.success" :warning="notification.warning" :error="notification.error">
      <p>{{ notification.message }}</p>
    </Notification>
  </div>
</template>
