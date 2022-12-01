<template>
  <div class="sm:flex sm:items-center">
    <slot></slot>
  </div>
  <div class="mt-8 flex flex-col">
    <div class="inline-block min-w-full py-2 align-middle">
      <div class="relative overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
        <div v-if="selectedRequests.length > 0" class="absolute top-0 left-12 flex h-12 items-center space-x-3 bg-gray-50 sm:left-16">
          <button type="button" class="inline-flex items-center rounded border border-gray-300 bg-pink-200 px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-200 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-30">Delete all</button>
          <button type="button" class="inline-flex items-center rounded border border-gray-300 bg-green-200 px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-200 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-30">Export</button>
        </div>
        <table class="min-w-full divide-y divide-gray-300">
          <thead class="bg-gray-50">
          <tr>
            <th v-if="loanRequests.length > 0" scope="col" class="relative w-12 px-6 sm:w-16 sm:px-8">
              <input type="checkbox" :checked="indeterminate || selectedRequests.length === loanRequests.length" :indeterminate="indeterminate" @change="setSelectedRequest" class="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-eg-bg focus:ring-eg-bg sm:left-6">
            </th>
            <th scope="col" class="whitespace-nowrap py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Request No.</th>
            <th scope="col" class="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">Date</th>
            <th scope="col" class="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">Member Name</th>
            <th scope="col" class="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">Loan Type</th>
            <th scope="col" class="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">Amount KSH</th>
            <th scope="col" class="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">No. Of Guarantors</th>
            <th scope="col" class="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
            <th scope="col" class="relative whitespace-nowrap py-3.5 pl-3 pr-4 sm:pr-6">
              <span class="sr-only">Action</span>
            </th>
          </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 bg-white">
          <tr v-if="loanRequests.length === 0">
            <td class="whitespace-nowrap px-2 py-2 text-sm font-medium text-gray-900">
              <span class="pl-4">No Available Loan Requests</span>
            </td>
          </tr>
          <tr v-for="item in loanRequests" :key="item.refId" :class="[selectedRequests.includes(item.refId) && 'bg-gray-100']">
            <td class="relative w-12 px-6 sm:w-16 sm:px-8">
              <!-- Selected row marker, only show when row is selected. -->
              <div v-if="selectedRequests.includes(item.refId)" class="absolute inset-y-0 left-0 w-0.5 bg-eg-bg"></div>

              <input type="checkbox" class="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-eg-bg focus:ring-eg-bg sm:left-6" :value="item.refId" v-model="selectedRequests">
            </td>
            <td :class="['whitespace-nowrap py-2 pl-4 pr-3 font-medium text-sm sm:pl-6' , selectedRequests.includes(item.refId) ? 'text-eg-blue' : 'text-gray-900']" >{{ item.loanRequestNumber }}</td>
            <td class="whitespace-nowrap px-2 py-2 text-sm font-medium text-gray-900">{{ item.loanDate }}</td>
            <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-900">{{ item.memberFirstName }} {{ item.memberLastName }}</td>
            <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{{ item.loanProductName }}</td>
            <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{{ item.loanAmount }}</td>
            <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{{ item.guarantorCount }}</td>
            <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{{ item.status }}</td>
            <td class="relative whitespace-nowrap py-2 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
              <button type="button" class="text-eg-text hover:text-eg-bg">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
                <span class="sr-only">, {{ item.refId }}</span>
              </button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, ref, toRefs} from "vue";
import {LoanRequestData} from "../stores/loan-request-store";

const props = defineProps<{
  loanRequests: LoanRequestData[]
}>()

const { loanRequests } = toRefs(props)

const selectedRequests = ref<string[]>([])

const checked = ref(false)

const indeterminate = computed(() => selectedRequests.value.length > 0 && selectedRequests.value.length < loanRequests.value.length)

const setSelectedRequest = (e: any) => {
  selectedRequests.value = (e.target && e.target.checked) ? loanRequests.value.map((p) => p.refId) : []
}
</script>
