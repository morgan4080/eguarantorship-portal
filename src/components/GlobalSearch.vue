<script setup lang="ts">
  import {RouteRecordName} from "vue-router";
  import {ref, watch, toRefs, reactive} from "vue";

  const props = defineProps<{
    ctx: RouteRecordName | null | undefined
    placeholder: string,
    hasFilter?: boolean,
    filterEntities?: any,
    filters?: any,
    customFilters?: any,
  }>()

  const { ctx, placeholder, hasFilter, filters, customFilters } = toRefs(props);

  const changed = ref<boolean>(false)
  const hasContent = ref<boolean>(false)
  const selected = ref<number | null>(null)
  const refDropDown = ref<HTMLDivElement | unknown>(null)

  const showList = () => {
    changed.value = !changed.value
    hasContent.value = !hasContent.value
  }

  const onClickAway = (ref: any, handler: any) => {
    const listener = (event: any) => {
      if (!ref || ref.contains(event.target)) {
        return;
      }
      handler(event);
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }

  const onMouseDown = (e:any) => {
    if (changed.value) e.preventDefault()
  }

  watch(changed, () => {
    onClickAway(refDropDown.value, () => changed.value = false)
  })

  const searchFilter = reactive({
    productRefId: customFilters && customFilters.value ? customFilters.value.productRefId : '',
    searchTerm: filters && filters.value ? filters.value.searchTerm : ''
  })

  const makeSelection = (val: number) => {
    changed.value = false
    selected.value = val
  }

  const emit = defineEmits(['update'])

  watch(searchFilter, () => {
    emit('update', searchFilter)
  })

</script>
<template>
  <div class="relative">
    <div v-if="hasFilter" class="absolute inset-y-0 left-0 flex items-center">
      <label for="loan-products" class="sr-only">Loan Products</label>
      <select v-model="searchFilter.productRefId" id="loan-products" autocomplete="loan-products" class="h-full rounded-full border-transparent bg-transparent py-0 pl-3 pr-10 text-gray-500 border-0 ring-0 focus:ring-eg-bg sm:text-sm">
        <option :value="``" selected>All Loan Requests</option>
        <option v-for="loanProd in filterEntities.getLoanProducts" :key="loanProd.refId" :value="loanProd.refId">{{ loanProd.name }}</option>
      </select>
    </div>
    <input @mousedown="onMouseDown($event)" v-model="searchFilter.searchTerm" type="search" :placeholder="placeholder" :class="{'pl-48' : hasFilter, 'pl-6' : !hasFilter}" class="w-full rounded-full border border-gray-300 bg-white py-2 pr-12 shadow-sm ring-0 focus:ring-eg-bg focus:border-eg-bg focus:outline-none sm:text-sm" aria-controls="options" :aria-expanded="changed">
  </div>
</template>
