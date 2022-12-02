<script setup lang="ts">
import stores from "../stores";
import { ExclamationTriangleIcon, CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/vue/24/outline';
const { authStore } = stores;
</script>
<template>
  <Teleport to="#teleport-target-notifications">
    <TransitionGroup enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
      <div v-for="(notification) in authStore.getNotification" :key="notification.id">
        <div v-if="notification.error" class="sm:flex sm:items-start bg-red-100 drop-shadow p-4 rounded-md my-1">
          <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-200 sm:mx-0 sm:h-10 sm:w-10">
            <ExclamationTriangleIcon class="h-6 w-6 text-red-600" aria-hidden="true" />
          </div>
          <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
            <h3 class="text-normal font-medium leading-6 text-gray-900">Error</h3>
            <div class="mt-1">
              <span class="text-xs text-gray-500">{{ notification.message }}</span>
            </div>
          </div>
        </div>
        <div v-if="notification.warning" class="sm:flex sm:items-start bg-red-100 drop-shadow p-4 rounded-md my-1">
          <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-200 sm:mx-0 sm:h-10 sm:w-10">
            <ExclamationCircleIcon class="h-6 w-6 text-red-600" aria-hidden="true" />
          </div>
          <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
            <h3 class="text-normal font-medium leading-6 text-orange-900">Warning</h3>
            <div class="mt-1">
              <span class="text-xs text-gray-500">{{ notification.message }}</span>
            </div>
          </div>
        </div>
        <div v-if="notification.success" class="sm:flex sm:items-start bg-green-100 drop-shadow p-4 rounded-md my-1">
          <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-200 sm:mx-0 sm:h-10 sm:w-10">
            <CheckCircleIcon class="h-6 w-6 text-green-600" aria-hidden="true" />
          </div>
          <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
            <h3 class="text-normal font-medium leading-6 text-gray-900">Success</h3>
            <div class="mt-1">
              <span class="text-xs text-gray-500">{{ notification.message }}</span>
            </div>
          </div>
        </div>
      </div>
    </TransitionGroup>
  </Teleport>
</template>
