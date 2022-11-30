<template>
  <div class="sm:flex sm:items-center">
    <slot></slot>
  </div>
  <div class="mt-8 flex flex-col">
    <div class="inline-block min-w-full py-2 align-middle">
      <div class="relative overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
        <div v-if="selectedRequests.length > 0" class="absolute top-0 left-12 flex h-12 items-center space-x-3 bg-gray-50 sm:left-16">
          <button type="button" class="inline-flex items-center rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-30">Delete all</button>
          <div class="inline-flex items-center rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-30"></div>
        </div>
        <table class="min-w-full divide-y divide-gray-300">
          <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="relative w-12 px-6 sm:w-16 sm:px-8">
              <input type="checkbox" :checked="indeterminate || selectedRequests.length === data.length" :indeterminate="indeterminate" @change="selectedRequests = ($event.target && $event.target.checked) ? data.map((p) => p.id) : []" class="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-eg-bg focus:ring-eg-bg sm:left-6">
            </th>
            <th scope="col" class="whitespace-nowrap py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Request No</th>
            <th scope="col" class="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">Date</th>
            <th scope="col" class="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">Member Name</th>
            <th scope="col" class="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">Loan Type</th>
            <th scope="col" class="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">Amount KSH</th>
            <th scope="col" class="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">Progress</th>
            <th scope="col" class="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
            <th scope="col" class="relative whitespace-nowrap py-3.5 pl-3 pr-4 sm:pr-6">
              <span class="sr-only">Action</span>
            </th>
          </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 bg-white">
          <tr v-for="item in data" :key="item.id" :class="[selectedRequests.includes(item.id) && 'bg-gray-50']">
            <td class="relative w-12 px-6 sm:w-16 sm:px-8">
              <!-- Selected row marker, only show when row is selected. -->
              <div v-if="selectedRequests.includes(item.id)" class="absolute inset-y-0 left-0 w-0.5 bg-eg-bg"></div>

              <input type="checkbox" class="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-eg-bg focus:ring-eg-bg sm:left-6" :value="item.id" v-model="selectedRequests">
            </td>
            <td :class="['whitespace-nowrap py-2 pl-4 pr-3 font-medium text-sm sm:pl-6' , selectedRequests.includes(item.id) ? 'text-eg-blue' : 'text-gray-900']" >{{ item.requestNo }}</td>
            <td class="whitespace-nowrap px-2 py-2 text-sm font-medium text-gray-900">{{ item.date }}</td>
            <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-900">{{ item.memberName }}</td>
            <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{{ item.loanType }}</td>
            <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{{ item.loanAmount }}</td>
            <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{{ item.progress }}</td>
            <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{{ item.status }}</td>
            <td class="relative whitespace-nowrap py-2 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
              <button type="button" class="text-eg-text hover:text-eg-bg">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
                <span class="sr-only">, {{ item.id }}</span>
              </button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <div class="flex items-center justify-between px-1">
    <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
      <div>
        <p class="text-sm text-gray-700">
          Showing
          <span class="font-medium">1</span>
          to
          <span class="font-medium">10</span>
          of
          <span class="font-medium">20</span>
          results
        </p>
      </div>
      <div class="flex h-8 space-x-2">
        <div>
          <label id="listbox-label" class="sr-only"> Change records count </label>
          <div class="relative">
            <div class="inline-flex shadow-sm rounded-md divide-x divide-eg-bg h-8">
              <div class="relative z-0 inline-flex shadow-sm rounded-md divide-x divide-eg-bg">
                <div class="relative inline-flex items-center bg-eg-bg py-2 pl-3 pr-4 border border-transparent rounded-l-md shadow-sm text-white">
                  <p class="ml-2.5 text-sm sm:text-sm font-medium">10</p>
                </div>
                <button type="button" class="relative inline-flex items-center bg-eg-bg p-2 rounded-l-none rounded-r-md text-sm font-medium text-white hover:bg-eg-bg focus:outline-none focus:z-10 focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-eg-bg" aria-haspopup="listbox" aria-expanded="true" aria-labelledby="listbox-label">
                  <span class="sr-only">Change records count</span>
                  <svg class="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                  </svg>
                </button>
              </div>
            </div>
            <ul class="origin-top-right absolute z-10 right-0 w-12 rounded-md shadow-lg overflow-hidden bg-white divide-y divide-gray-200 ring-1 ring-black ring-opacity-5 focus:outline-none" tabindex="-1" role="listbox" aria-labelledby="listbox-label" aria-activedescendant="listbox-option-0" enter-class="" leave-class="opacity-100" style="display: none;">
              <li class="text-gray-900 cursor-pointer select-none relative p-4 text-sm" id="listbox-option-0" role="option">
                <div class="flex flex-col">
                  <div class="flex justify-between">
                    <p class="font-normal text-sm sm:text-sm">10</p>
                  </div>
                </div>
              </li>
              <li class="text-gray-900 cursor-pointer select-none relative p-4 text-sm" id="listbox-option-0" role="option">
                <div class="flex flex-col">
                  <div class="flex justify-between">
                    <p class="font-normal font-normal text-sm sm:text-sm">50</p>
                  </div>
                </div>
              </li>
              <li class="text-gray-900 cursor-pointer select-none relative p-4 text-sm" id="listbox-option-0" role="option">
                <div class="flex flex-col">
                  <div class="flex justify-between">
                    <p class="font-normal font-normal text-sm sm:text-sm">100</p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
          <button type="button" class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
            <span class="sr-only">Previous</span>
            <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd"></path>
            </svg>
          </button>
          <div class="z-10 bg-gray-200 border-gray-300 text-eg-text relative inline-flex items-center px-4 py-2 border text-sm font-medium">1</div>
          <button type="button" class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
            <span class="sr-only">Next</span>
            <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
            </svg>
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, ref} from "vue";
type LoanRequest = {id: number, requestNo: string, date: string, memberName: string, loanType: string, loanAmount: string, progress: string, status: string}
const data: LoanRequest[] = [
  {
    id: 1,
    requestNo: 'S:429436:04:2017',
    date: new Date().toLocaleDateString('en-gb'),
    memberName: 'Morgan Mutugi',
    loanType: 'BOSA Loan',
    loanAmount: 'KES 3,509,000',
    progress: '12',
    status: 'PENDING',
  },
  {
    id: 2,
    requestNo: 'S:429436:04:2017',
    date: new Date().toLocaleDateString('en-gb'),
    memberName: 'Morgan Mutugi',
    loanType: 'BOSA Loan',
    loanAmount: 'KES 3,509,000',
    progress: '12',
    status: 'PENDING',
  },
  {
    id: 3,
    requestNo: 'S:429436:04:2017',
    date: new Date().toLocaleDateString('en-gb'),
    memberName: 'Morgan Mutugi',
    loanType: 'BOSA Loan',
    loanAmount: 'KES 3,509,000',
    progress: '12',
    status: 'PENDING',
  },
  {
    id: 4,
    requestNo: 'S:429436:04:2017',
    date: new Date().toLocaleDateString('en-gb'),
    memberName: 'Morgan Mutugi',
    loanType: 'BOSA Loan',
    loanAmount: 'KES 3,509,000',
    progress: '12',
    status: 'PENDING',
  },
  {
    id: 5,
    requestNo: 'S:429436:04:2017',
    date: new Date().toLocaleDateString('en-gb'),
    memberName: 'Morgan Mutugi',
    loanType: 'BOSA Loan',
    loanAmount: 'KES 3,509,000',
    progress: '12',
    status: 'PENDING',
  },
  {
    id: 6,
    requestNo: 'S:429436:04:2017',
    date: new Date().toLocaleDateString('en-gb'),
    memberName: 'Morgan Mutugi',
    loanType: 'BOSA Loan',
    loanAmount: 'KES 3,509,000',
    progress: '12',
    status: 'PENDING',
  },
  {
    id: 7,
    requestNo: 'S:429436:04:2017',
    date: new Date().toLocaleDateString('en-gb'),
    memberName: 'Morgan Mutugi',
    loanType: 'BOSA Loan',
    loanAmount: 'KES 3,509,000',
    progress: '12',
    status: 'PENDING',
  },
  {
    id: 8,
    requestNo: 'S:429436:04:2017',
    date: new Date().toLocaleDateString('en-gb'),
    memberName: 'Morgan Mutugi',
    loanType: 'BOSA Loan',
    loanAmount: 'KES 3,509,000',
    progress: '12',
    status: 'PENDING',
  }
]

const selectedRequests = ref<number[]>([])

const checked = ref(false)

const indeterminate = computed(() => selectedRequests.value.length > 0 && selectedRequests.value.length < data.length)
</script>
