<script setup lang="ts">
  import {RouteRecordName} from "vue-router";
  import {ref, watch, toRefs, reactive} from "vue";

  const props = defineProps<{
    ctx: RouteRecordName | null | undefined
    placeholder: string,
    hasFilter?: boolean,
    filterEntities?: any,
  }>()

  const { ctx, placeholder, hasFilter } = toRefs(props);

  const changed = ref<boolean>(false)
  const hasContent = ref<boolean>(false)
  const hovering = ref<string>('')
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
    refId: '',
    searchTerm: ''
  })

  const makeSelection = (val: number) => {
    changed.value = false
    selected.value = val
    // searchFilter.searchTerm = 'Leslie Alexander'
    // navigate to searched item
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
      <select v-model="searchFilter.refId" id="loan-products" autocomplete="loan-products" class="h-full rounded-full border-transparent bg-transparent py-0 pl-3 pr-10 text-gray-500 border-0 ring-0 focus:ring-eg-bg sm:text-sm">
        <option :value="``" selected>All Loan Requests</option>
        <option v-for="loanProd in filterEntities.getLoanProducts" :key="loanProd.refId" :value="loanProd.refId">{{ loanProd.name }}</option>
      </select>
    </div>
    <input @mousedown="onMouseDown($event)" v-model="searchFilter.searchTerm" id="combobox" type="text" :placeholder="placeholder" :class="{'pl-48' : hasFilter, 'pl-6' : !hasFilter}" class="w-full rounded-full border border-gray-300 bg-white py-2 pr-12 shadow-sm ring-0 focus:ring-eg-bg focus:border-eg-bg focus:outline-none sm:text-sm" role="combobox" aria-controls="options" :aria-expanded="changed">

    <button @click="showList" type="button" class="absolute inset-y-0 right-0 flex items-center rounded-r-md px-4 focus:outline-none">
      <svg class="h-5 w-5 text-eg-bg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
      </svg>
    </button>

    <ul ref="refDropDown" v-show="changed && hasContent" class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm" id="options" role="listbox">
      <!--
        Combobox option, manage highlight styles based on mouseenter/mouseleave and keyboard navigation.

        Active: "text-white bg-amber-600", Not Active: "text-gray-900"
      -->
      <li @click="makeSelection(i)" v-for="(n, i) in 5" :key="i" @mouseenter="hovering = `${i}`" @mouseleave="hovering = ''" :class="{'text-white bg-amber-600': hovering === `${i}`, 'text-gray-900': hovering !== `${i}` }" class="group relative transform translate-all cursor-default select-none py-2 pl-3 pr-9" :id="`option-${i}`" role="option" :tabindex="i">
        <!-- Selected: "font-semibold" -->
        <span :class="{'font-semibold': selected === i}" class="block truncate">Leslie Alexander</span>

        <!--
          Checkmark, only display for selected option.

          Active: "text-white", Not Active: "text-amber-600"
        -->
        <span :class="{'text-white': selected === i, 'text-amber-600': selected !== i}" class="absolute inset-y-0 right-0 flex items-center pr-4 text-amber-600 group-hover:text-white">
          <!-- Heroicon name: solid/check -->
          <svg v-if="selected === i" class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
        </span>
      </li>

      <!-- More items... -->
    </ul>
  </div>
</template>
