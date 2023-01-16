<template>
  <div class="sm:flex sm:items-center">
    <slot></slot>
  </div>
  <div class="mt-8 flex flex-col">
    <div class="inline-block min-w-full py-2 align-middle">
      <div class="relative overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
        <div v-if="selectedRequests.length > 0" class="absolute top-0 left-12 flex h-12 items-center space-x-3 bg-gray-50 sm:left-16">
          <button @click="deleteLoanRequest" type="button" class="inline-flex items-center rounded border border-gray-300 bg-pink-200 px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-200 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-30">Delete</button>
          <button @click="exportLoanRequest" type="button" class="inline-flex items-center rounded border border-teal-300 bg-teal-200 px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-teal-50 focus:outline-none focus:ring-2 focus:ring-teal-200 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-30">Export</button>
        </div>
        <table class="min-w-full divide-y divide-gray-300">
          <thead class="bg-gray-50">
          <tr>
            <th v-if="loanRequests.length > 0" scope="col" class="relative w-12 px-6 sm:w-16 sm:px-8">
              <input type="checkbox" :checked="indeterminate || selectedRequests.length === loanRequests.length" :indeterminate="indeterminate" @change="setSelectedRequest" class="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-eg-bg focus:ring-eg-bg sm:left-6">
            </th>
            <th scope="col" class="whitespace-nowrap py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Request No.</th>
            <th scope="col" class="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">Date</th>
            <th scope="col" class="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">Name</th>
            <th scope="col" class="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">Loan Type</th>
            <th scope="col" class="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">Amount</th>
            <th scope="col" class="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">Percentage</th>
            <th scope="col" class="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">Application Status</th>
            <th scope="col" class="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">Signing Status</th>
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
            <tr v-for="item in loanRequests" :key="item.refId" :class="[selectedRequests.includes(item.loanRequestNumber) && 'bg-gray-300']">
              <td class="relative w-12 px-6 sm:w-16 sm:px-8" :class="[!item.isActive && 'opacity-70']">
                <!-- Selected row marker, only show when row is selected. -->
                <div v-if="selectedRequests.includes(item.loanRequestNumber)" class="absolute inset-y-0 left-0 w-0.5 bg-eg-bg"></div>

                <input type="checkbox" class="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-eg-bg focus:ring-eg-bg sm:left-6" :value="item.loanRequestNumber" v-model="selectedRequests">
              </td>
              <td :class="['whitespace-nowrap py-2 pl-4 pr-3 font-medium text-sm sm:pl-6' , selectedRequests.includes(item.loanRequestNumber) ? 'text-eg-blue' : 'text-gray-900', !item.isActive && 'opacity-70']" >
                <router-link :to="`/loan-requests/${item.refId}/view`">{{ item.loanRequestNumber }}</router-link>
              </td>
              <td class="whitespace-nowrap px-2 py-2 text-sm font-medium text-gray-500" :class="[!item.isActive && 'opacity-70']">
                <router-link :to="`/loan-requests/${item.refId}/view`">{{ item.loanDate }}</router-link>
              </td>
              <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-500" :class="[!item.isActive && 'opacity-70']">
                <router-link :to="`/loan-requests/${item.refId}/view`">{{ item.memberFirstName }} {{ item.memberLastName }}</router-link>
              </td>
              <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-500" :class="[!item.isActive && 'opacity-70']">
                <router-link :to="`/loan-requests/${item.refId}/view`">{{ item.loanProductName }}</router-link>
              </td>
              <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-500" :class="[!item.isActive && 'opacity-70']">
                <router-link :to="`/loan-requests/${item.refId}/view`">{{ $filters.currencyKES(item.loanAmount) }}</router-link>
              </td>
              <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-500" :class="[!item.isActive && 'opacity-70']">
                <router-link :to="`/loan-requests/${item.refId}/view`">{{ item.loanRequestProgress }}</router-link>
              </td>
              <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-500" :class="[!item.isActive && 'opacity-70']">
                <router-link :to="`/loan-requests/${item.refId}/view`">{{ item.applicationStatus }}</router-link>
              </td>
              <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-500" :class="[!item.isActive && 'opacity-70']">
                <router-link :to="`/loan-requests/${item.refId}/view`">{{ item.applicationStatus === 'INPROGRESS' && item.signingStatus === 'ERROR' ? 'PENDING' : item.signingStatus }}</router-link>
              </td>
              <td class="relative whitespace-nowrap py-2 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                <DropDown :items="[
                  {
                    id: 1,
                    name: 'View Loan Request',
                    icon: EyeIcon,
                    href: `/loan-requests/${item.refId}/view`
                  }
                ]">
                  <MenuButton class="text-eg-text hover:text-eg-bg">
                    <EllipsisVerticalIcon class="h-6 w-6" aria-hidden="true" />
                  </MenuButton>
                </DropDown>
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
  import DropDown from "./DropDown.vue";
  import {EllipsisVerticalIcon, EyeIcon} from "@heroicons/vue/20/solid";
  import {MenuButton} from "@headlessui/vue";
  import stores from "../stores";
  const { loanRequestStore, authStore } = stores;

  const props = defineProps<{
    loanRequests: LoanRequestData[]
  }>()

  const { loanRequests } = toRefs(props)

  const selectedRequests = ref<string[]>([])

  const checked = ref(false)

  const indeterminate = computed(() => selectedRequests.value.length > 0 && selectedRequests.value.length < loanRequests.value.length)

  const setSelectedRequest = (e: any) => {
    selectedRequests.value = (e.target && e.target.checked) ? loanRequests.value.map((p) => p.loanRequestNumber) : []
  }
  const deleteLoanRequest = async () => {
    if (confirm(`Are you sure you want to delete: ${selectedRequests.value.length} loan request?`)) {
      await Promise.allSettled([...new Set(selectedRequests.value)].map(async (loanRequestNumber: string) => {
        await loanRequestStore.deleteLoanRequest(loanRequestNumber)
      }));
      await loanRequestStore.fetchLoanRequests(`?pageSize=10&pageIndex=0&isActive=true`);
      authStore.defineNotification({
        id: (Math.random().toString(36) + Date.now().toString(36)).substring(2),
        message: 'Deleted Loan requests successfully',
        success: true
      })
      selectedRequests.value = []
    }
  }

  const exportLoanRequest = async () => {
    if (confirm(`Are you sure you want to export: ${selectedRequests.value.length} loan request?`)) {
      let base = `?loanRequestNumbers=`;
      const uniqueLy = [...new Set(selectedRequests.value)];
      uniqueLy.map(async (loanRequestNumber: string, i: number) => {
        if ((uniqueLy.length - 1) === i) {
          base += `${loanRequestNumber}`
        } else {
          base += `${loanRequestNumber}%7C`
        }
      });
      const url = await loanRequestStore.exportLoanRequests(`${base}`);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', new Date().toLocaleTimeString('en-GB') + 'loan-requests.csv');
      document.body.appendChild(link);
      link.click();
      await loanRequestStore.fetchLoanRequests(`?pageSize=10&pageIndex=0&isActive=true`);
      authStore.defineNotification({
        id: (Math.random().toString(36) + Date.now().toString(36)).substring(2),
        message: 'Exported Loan requests successfully',
        success: true
      })
      selectedRequests.value = []
    }
  }
</script>
