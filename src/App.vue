<script setup lang="ts">
import SideBar from './components/SideBar.vue'
import Notification from './components/Notification.vue'
import stores from "./stores"
const authStore = stores.authStore
</script>

<template>
  <SideBar>
    <router-view></router-view>
  </SideBar>
  <Notification />
</template>
