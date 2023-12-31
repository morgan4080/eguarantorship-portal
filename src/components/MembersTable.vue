<template>
  <div class="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 items-end sm:items-center">
    <slot></slot>
  </div>
  <div class="mt-8 flex flex-col">
    <div class="inline-block min-w-full py-2 align-middle">
      <div class="relative overflow-x-auto shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
        <div v-if="selectedRequests.length > 0" class="absolute top-0 left-12 flex h-12 items-center space-x-3 bg-slate-50 sm:left-16">
         <button @click="exportSelectedMembers" type="button" class="inline-flex items-center rounded border border-slate-400 bg-green-200 px-2.5 py-1.5 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-green-200 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-30">Export</button>
        </div>
        <table class="min-w-full divide-y divide-slate-300">
          <thead class="bg-slate-50">
            <tr>
              <th v-if="members.length > 0" scope="col" class="relative w-12 px-6 sm:w-16 sm:px-8">
                <input type="checkbox" :checked="indeterminate || selectedRequests.length === members.length" :indeterminate="indeterminate" @change="setSelectedRequest" class="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-slate-400 text-eg-bg focus:ring-eg-bg sm:left-6">
              </th>
              <th scope="col" class="whitespace-nowrap py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-900 sm:pl-6">Member No.</th>
              <th scope="col" class="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-slate-900">Member Name</th>
              <th scope="col" class="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-slate-900">Phone No.</th>
              <th scope="col" class="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-slate-900">Email</th>
              <th scope="col" class="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-slate-900">Shares</th>
              <th scope="col" class="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-slate-900">Status</th>
              <th scope="col" class="relative whitespace-nowrap py-3.5 pl-3 pr-4 sm:pr-6">
                <span class="sr-only">Action</span>
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200 bg-white">
            <tr v-if="members.length === 0">
              <td class="whitespace-nowrap px-2 py-2 text-sm font-medium text-slate-900">
                <span class="pl-4">No Available Members.</span>
              </td>
            </tr>
            <tr v-for="item in members" :key="item.refId" :class="[selectedRequests.includes(item.refId) && 'bg-slate-100']">
              <td class="relative w-12 px-6 sm:w-16 sm:px-8">
                <!-- Selected row marker, only show when row is selected. -->
                <div v-if="selectedRequests.includes(item.refId)" class="absolute inset-y-0 left-0 w-0.5 bg-eg-bg"></div>

                <input type="checkbox" class="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-slate-400 text-eg-bg focus:ring-eg-bg sm:left-6" :value="item.memberNumber" v-model="selectedRequests">
              </td>
              <td :class="['whitespace-nowrap py-2 pl-4 pr-3 font-medium text-sm sm:pl-6' , selectedRequests.includes(item.refId) ? 'text-eg-blue' : 'text-slate-900']" >
                <router-link :to="`/members/${item.refId}/view`">{{ item.memberNumber }}</router-link>
              </td>
              <td class="whitespace-nowrap px-2 py-2 text-sm text-slate-900">
                <router-link :to="`/members/${item.refId}/view`">{{ item.firstName }} {{ item.lastName }}</router-link>
              </td>
              <td class="whitespace-nowrap px-2 py-2 text-sm text-slate-500">
                <router-link :to="`/members/${item.refId}/view`">{{ item.phoneNumber }}</router-link>
              </td>
              <td class="whitespace-nowrap px-2 py-2 text-sm text-slate-500">
                <router-link :to="`/members/${item.refId}/view`">{{ item.email }}</router-link>
              </td>
              <td class="whitespace-nowrap px-2 py-2 text-sm text-slate-500">
                <router-link :to="`/members/${item.refId}/view`">{{ $filters.currencyKES(item.totalShares) }}</router-link>
              </td>
              <td class="whitespace-nowrap px-2 py-2 text-sm text-slate-500">
                <router-link :to="`/members/${item.refId}/view`">{{ item.memberStatus }}</router-link>
              </td>
              <td class="relative whitespace-nowrap py-2 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                <DropDown :items="[
                  {
                    id: 1,
                    name: 'View Member',
                    icon: EyeIcon,
                    href: `/members/${item.refId}/view`
                  },
                  {
                    id: 2,
                    name: 'Edit Members',
                    icon: PencilIcon,
                    href: `/members/${item.refId}/edit`
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
import {Member} from "../stores/member-store";
import {MenuButton} from "@headlessui/vue";
import DropDown from "./DropDown.vue";
import {EllipsisVerticalIcon, EyeIcon, PencilIcon} from "@heroicons/vue/20/solid";
import stores from "../stores";
const { memberStore, authStore } = stores;

const props = defineProps<{
  members: Member[]
}>()

const { members } = toRefs(props)

const selectedRequests = ref<string[]>([])

const checked = ref(false)

const indeterminate = computed(() => selectedRequests.value.length > 0 && selectedRequests.value.length < members.value.length)

const setSelectedRequest = (e: any) => {
  selectedRequests.value = (e.target && e.target.checked) ? members.value.map((p) => {
    return p.memberNumber;
  }) : []
}
const deleteSelectedMembers = () => {
  if (confirm('Feature Not Supported')) {

  }
}
const exportSelectedMembers = async () => {
  if (confirm('You are about to export, ' + selectedRequests.value.length + 'Members. Proceed?' )) {
    let base = `?memberNumbers=`;
    const uniqueLy = [...new Set(selectedRequests.value)];
    uniqueLy.map(async (memberNumber: string, i: number) => {
      if ((uniqueLy.length - 1) === i) {
        base += `${memberNumber}`
      } else {
        base += `${memberNumber}%7C`
      }
    });
    const url = await memberStore.exportMembers(`${base}`);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', new Date().toLocaleTimeString('en-GB') + 'members.csv');
    document.body.appendChild(link);
    link.click();
    await memberStore.fetchMembers(`?order=ASC&pageSize=10&pageIndex=0`);
    authStore.defineNotification({
      id: (Math.random().toString(36) + Date.now().toString(36)).substring(2),
      message: 'Exported Members successfully',
      success: true
    });
    selectedRequests.value = []
  }
}
</script>
