<script setup lang="ts">
import {toRefs} from "vue";

const props = defineProps<{
  pageName: string
  linkUrl: string
  linkName: string
  current: string
}>()

const { pageName, linkUrl, linkName, current } = toRefs(props);
</script>
<template>
  <div>
    <h2 v-if="pageName !== ''" class="font-semibold text-xl text-eg-bg">{{ pageName }}</h2>
    <nav aria-label="Breadcrumb" class="flex">
      <ol role="list" class="flex items-center">

        <li>
          <div class="flex items-center">
            <router-link :to="linkUrl" class="text-sm font-normal leading-7 text-gray-900 sm:leading-9 sm:truncate" style="color: #9e9e9e;background-color: transparent;">{{ linkName }}</router-link>
          </div>
        </li>

        <li>
          <div class="flex items-center">
            <svg class="flex-shrink-0 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
            </svg>
            <h1 class="text-sm font-normal leading-7 text-eg-bg sm:leading-9 sm:truncate">
              {{ current }}
            </h1>
          </div>
        </li>
      </ol>
    </nav>
  </div>
</template>
