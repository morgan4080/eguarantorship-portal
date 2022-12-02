<script setup lang="ts">
import Breadcrumb from "../../components/Breadcrumb.vue";
import {useRoute, useRouter} from "vue-router";
import {onMounted} from "vue";
import stores from "../../stores";
const { memberStore } = stores;
const router = useRouter();
const route = useRoute();
onMounted(async () => {
  await Promise.all([
    memberStore.fetchMember(`${route.params.refId}`)
  ])
})
</script>
<template>
  <div class="w-full pt-16 pb-32">
    <div class="space-y-6 sm:px-6 lg:px-5">
      <div class="flex justify-between items-center">
        <Breadcrumb pageName="" linkName="All Members" linkUrl="/members"  current="View Member"/>
      </div>
      <div class="bg-white px-4 py-5 shadow sm:rounded-lg sm:px-6">
        <h2 id="timeline-title" class="text-lg font-medium text-gray-900">Timeline</h2>
      </div>
    </div>
  </div>
</template>
