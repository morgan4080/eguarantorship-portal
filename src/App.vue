<script setup lang="ts">
import TheNavBar from './components/TheNavBar.vue'
import TheSideBar from './components/TheSideBar.vue'
import Notification from './components/Notification.vue'
import stores from "./stores"
import Dialogue from "./components/Dialogue.vue";
const authStore = stores.authStore
</script>

<template>
  <TheNavBar class="fixed w-screen" />
  <div class="flex min-h-screen" >
    <TheSideBar v-if="$route.name !== 'Landing' && $route.name !== 'Password-Reset'" />
    <router-view></router-view>
  </div>
  <Notification />
</template>
