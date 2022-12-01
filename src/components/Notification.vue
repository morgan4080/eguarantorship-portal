<script setup lang="ts">
import {toRefs} from "vue";
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline'
const props = defineProps<{
  success?: boolean,
  error?: boolean,
  warning?: boolean,
  title?: string,
  message?: string
}>()

const { success, error, warning } = toRefs(props);
</script>
<template>
  <Teleport to="#teleport-target">
    <div v-if="error" class="sm:flex sm:items-start">
      <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
        <ExclamationTriangleIcon class="h-6 w-6 text-red-600" aria-hidden="true" />
      </div>
      <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
        <h3 class="text-lg font-medium leading-6 text-gray-900">{{ title }}</h3>
        <div class="mt-2">
          <p class="text-sm text-gray-500">{{ message }}</p>
        </div>
      </div>
    </div>
    <div v-if="warning" class="sm:flex sm:items-start">
      <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
        <ExclamationTriangleIcon class="h-6 w-6 text-red-600" aria-hidden="true" />
      </div>
      <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
        <h3 class="text-lg font-medium leading-6 text-orange-900">{{ title }}</h3>
        <div class="mt-2">
          <p class="text-sm text-gray-500">{{ message }}</p>
        </div>
      </div>
    </div>
    <div v-if="success" class="sm:flex sm:items-start">
      <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
        <ExclamationTriangleIcon class="h-6 w-6 text-green-600" aria-hidden="true" />
      </div>
      <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
        <h3 class="text-lg font-medium leading-6 text-gray-900">{{ title }}</h3>
        <div class="mt-2">
          <p class="text-sm text-gray-500">{{ message }}</p>
        </div>
      </div>
    </div>
  </Teleport>
</template>
