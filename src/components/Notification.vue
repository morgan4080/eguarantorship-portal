<script setup lang="ts">
import stores from "../stores";
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline';
const { authStore } = stores
</script>
<template>
  <Teleport to="#teleport-target-notifications">
    <div v-for="(notification, i) in authStore.getNotification" :key="i">
      <div v-if="notification.error" class="sm:flex sm:items-start bg-red-100 drop-shadow px-3 py-6">
        <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-200 sm:mx-0 sm:h-10 sm:w-10">
          <ExclamationTriangleIcon class="h-6 w-6 text-red-600" aria-hidden="true" />
        </div>
        <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
          <h3 class="text-lg font-medium leading-6 text-gray-900">Error</h3>
          <div class="mt-2">
            <p class="text-sm text-gray-500">{{ notification.message }}</p>
          </div>
        </div>
      </div>
      <div v-if="notification.warning" class="sm:flex sm:items-start bg-red-100 drop-shadow px-3 py-6">
        <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-200 sm:mx-0 sm:h-10 sm:w-10">
          <ExclamationTriangleIcon class="h-6 w-6 text-red-600" aria-hidden="true" />
        </div>
        <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
          <h3 class="text-lg font-medium leading-6 text-orange-900">Warning</h3>
          <div class="mt-2">
            <p class="text-sm text-gray-500">{{ notification.message }}</p>
          </div>
        </div>
      </div>
      <div v-if="notification.success" class="sm:flex sm:items-start bg-red-100 drop-shadow px-3 py-6">
        <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-200 sm:mx-0 sm:h-10 sm:w-10">
          <ExclamationTriangleIcon class="h-6 w-6 text-green-600" aria-hidden="true" />
        </div>
        <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
          <h3 class="text-lg font-medium leading-6 text-gray-900">Success</h3>
          <div class="mt-2">
            <p class="text-sm text-gray-500">{{ notification.message }}</p>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
