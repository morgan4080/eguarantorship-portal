<template>
  <div class="w-full pt-16 pb-32">
    <div class="space-y-6 sm:px-6 lg:px-5">
      <div class="flex justify-between items-center">
        <Breadcrumb pageName="" linkName="All Members" linkUrl="/members"  current="Create Members"/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Breadcrumb from "../../components/Breadcrumb.vue";
</script>