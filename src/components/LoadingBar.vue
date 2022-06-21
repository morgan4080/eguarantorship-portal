<script setup lang="ts">
import {ref, toRefs} from "vue";

const props = defineProps<{
  loading: boolean
}>()

const { loading } = toRefs(props);

const alternating = ref(<boolean> false)

const intervalCustom = ref(<any>null)

if (loading.value) {
  setInterval(() => {
    alternating.value = !alternating.value
  },500)
} else {

}
</script>
<template>
  <hr :class="{'from-amber-500 to-blue-300': alternating, 'from-blue-300 to-amber-500': !alternating}" class="absolute h-1 transform transition-all bg-gradient-to-r rounded-full">
</template>
