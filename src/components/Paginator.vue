<script lang="ts" setup>
import { createPopper } from "@popperjs/core";
import { computed, ComputedRef, ref, toRefs, watch } from "vue";
const totalRecords = ref(<number>0);
const pageCountOpen = ref(<boolean>false);
const props = defineProps<{
  totalPages: number;
  filterForm: {
    recordsPerPage: number;
    searchTerm: string;
    order?: string;
    page: number;
  };
  currentPage: number;
  totalElements: number;
}>();
const { totalPages, totalElements, filterForm, currentPage } = toRefs(props);
const emit = defineEmits(["refreshNext", "refreshPrev", "refreshCurrent"]);
const changePage = (act: string): void => {
  if (act === "add") {
    emit("refreshNext", currentPage.value);
  } else if (act === "subtract") {
    emit("refreshPrev", currentPage.value);
  }
};
const popcorn = ref(<any>null);
const tooltip = ref(<any>null);
const lots = ref(<number[]>[10, 50, 100]);
const activeIndex = ref(<any>null);
const selectedIndex = ref(<any>null);
const choose = (index: number) => {
  selectedIndex.value = index;
  filterForm.value.recordsPerPage = lots.value[index];
  pageCountOpen.value = !pageCountOpen.value;
  emit("refreshCurrent");
};
watch(pageCountOpen, () => {
  console.log("pageCountOpen", pageCountOpen.value);
  if (pageCountOpen.value) {
    createPopper(popcorn.value, tooltip.value, {
      placement: 'top-start',
      modifiers: [
        {
          name: "offset",
          options: {
            offset: [50, 165],
          },
        },
      ],
    });
  }
});
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
};
const refDropDown = ref(<HTMLUListElement>(<unknown>null));
watch(pageCountOpen, () => {
  onClickAway(refDropDown.value, () => (pageCountOpen.value = false));
});
const computedCurrentPage: ComputedRef<number> = computed(() => {
  return currentPage.value;
});
</script>

<template>
  <section>
    <div class="py-6 px-4 sm:p-6">
      <div class="flex items-center justify-between">
        <div
            class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between"
        >
          <div>
            <p class="text-sm text-gray-700">
              Showing
              <span class="font-medium">{{
                  currentPage === 1
                      ? 1
                      : (currentPage - 1) * filterForm.recordsPerPage + 1
                }}</span>
              to
              <span class="font-medium">{{
                  currentPage === 1
                      ? filterForm.recordsPerPage
                      : currentPage * filterForm.recordsPerPage
                }}</span>
              of
              <span class="font-medium">{{ totalElements }}</span>
              results
            </p>
          </div>
          <div class="flex h-8 space-x-2">
            <div>
              <label
                  id="listbox-label"
                  class="sr-only"
              >
                Change records count
              </label>
              <div class="relative">
                <div
                    ref="popcorn"
                    class="inline-flex h-8 divide-x divide-eg-bg rounded-md shadow-2xl"
                >
                  <div
                      class="relative z-0 inline-flex divide-x divide-eg-bg rounded-md shadow-sm"
                  >
                    <div
                        class="relative inline-flex items-center rounded-l-md border border-transparent bg-eg-bg py-2 pl-3 pr-4 text-white shadow-sm"
                    >
                      <p class="ml-2.5 text-xs font-medium sm:text-sm">
                        {{ filterForm.recordsPerPage }}
                      </p>
                    </div>
                    <button
                        type="button"
                        @click="pageCountOpen = !pageCountOpen"
                        class="relative inline-flex items-center rounded-l-none rounded-r-md bg-eg-bg p-2 text-sm font-medium text-white hover:bg-eg-bg focus:z-10 focus:outline-none focus:ring-2 focus:ring-eg-bg focus:ring-offset-2 focus:ring-offset-gray-50"
                        aria-haspopup="listbox"
                        aria-expanded="true"
                        aria-labelledby="listbox-label"
                    >
                      <span class="sr-only">Change records count</span>
                      <svg
                          class="h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                      >
                        <path
                            fill-rule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clip-rule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                <div ref="tooltip">
                  <ul
                      ref="refDropDown"
                      v-show="pageCountOpen"
                      class="absolute border border-gray-300 right-0 z-10 w-12 origin-top-right divide-y divide-gray-200 overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 drop-shadow-2xl focus:outline-none"
                      tabindex="-1"
                      role="listbox"
                      aria-labelledby="listbox-label"
                      aria-activedescendant="listbox-option-0"
                  >
                    <li
                        v-for="(lot, i) in lots"
                        :key="i"
                        @click="choose(i)"
                        @mouseenter="activeIndex = i"
                        @mouseleave="activeIndex = null"
                        :class="{
                        'bg-eg-bg text-white': activeIndex === i,
                        'text-gray-900': !(activeIndex === i),
                      }"
                        class="relative cursor-pointer select-none p-4 text-sm"
                        id="listbox-option-0"
                        role="option"
                    >
                      <div class="flex flex-col">
                        <div class="flex justify-between">
                          <p
                              :class="{
                              'font-semibold': selectedIndex === i,
                              'font-normal': !(selectedIndex === i),
                            }"
                              class="text-xs font-normal sm:text-sm"
                          >
                            {{ lot }}
                          </p>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <nav
                class="relative z-0 inline-flex -space-x-px rounded-md shadow-sm"
                aria-label="Pagination"
            >
              <button
                  @click="!(currentPage <= 1) ? changePage('subtract') : null"
                  type="button"
                  class="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <span class="sr-only">Previous</span>
                <svg
                    class="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                >
                  <path
                      fill-rule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                  />
                </svg>
              </button>
              <div
                  :class="{
                  'z-10 border-eg-bg bg-blue-50 text-eg-bg':
                    currentPage === filterForm.page,
                  'border-gray-300 bg-white text-gray-500 hover:bg-gray-50':
                    currentPage !== filterForm.page,
                }"
                  class="relative inline-flex items-center border px-4 py-2 text-sm font-medium"
              >
                {{ computedCurrentPage }}
              </div>
              <button
                  @click="!(currentPage > totalPages) ? changePage('add') : null"
                  type="button"
                  class="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <span class="sr-only">Next</span>
                <svg
                    class="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                >
                  <path
                      fill-rule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clip-rule="evenodd"
                  />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>