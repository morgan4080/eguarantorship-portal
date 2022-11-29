<script setup lang="ts">
import {ref, watch, toRefs, onMounted} from "vue";
import mainStore from "../utils/store";
import {RouteRecordName} from "vue-router";


const props = defineProps<{
  ctx: RouteRecordName | null | undefined
  placeholder: string
}>()

const { ctx, placeholder } = toRefs(props);

const changed = ref<boolean>(false)
const hasContent = ref<boolean>(false)
const hovering = ref<string>('')
const searchTerm = ref<string>('')
const selected = ref<number | null>(null)
const refDropDown = ref<HTMLDivElement | unknown>(null)


const doSearch = (e: Event) => {
  mainStore.setLoading(true)
  console.log(e)
  changed.value = true
  setTimeout(() => {
    mainStore.setLoading(false)
    hasContent.value = true
  }, 1000)
}

const showList = () => {
  changed.value = !changed.value
  hasContent.value = !hasContent.value
}

const makeSelection = (val: number) => {
  changed.value = false
  selected.value = val
  searchTerm.value = 'Leslie Alexander'
  // navigate to searched item
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

onMounted(() => {
  console.log(ctx.value)
})

</script>
<template>
  <div class="relative">
    <input @mousedown="onMouseDown($event)" @input="doSearch" v-model="searchTerm" id="combobox" type="text" :placeholder="placeholder" class="w-full rounded-full border border-gray-300 bg-white py-2 pl-3 pr-12 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 sm:text-sm" role="combobox" aria-controls="options" :aria-expanded="changed">

    <button @click="showList" type="button" class="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
      <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
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
