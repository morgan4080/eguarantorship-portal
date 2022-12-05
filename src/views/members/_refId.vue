<script setup lang="ts">
import Breadcrumb from "../../components/Breadcrumb.vue";
import {useRoute, useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import {ChevronDownIcon} from "@heroicons/vue/24/outline"
import stores from "../../stores";
const { memberStore } = stores;
const router = useRouter();
const route = useRoute();
onMounted(async () => {
  await Promise.all([
    memberStore.fetchMember(`${route.params.refId}`)
  ])
})
const otherDetails = ref<boolean>(false)
</script>
<template>
  <div class="w-full pt-16 pb-32">
    <div class="space-y-6 sm:px-6 lg:px-5">
      <div class="flex justify-between items-center">
        <Breadcrumb pageName="" linkName="All Members" linkUrl="/members"  current="View Member"/>
      </div>
      <div class="bg-white px-4 py-5 shadow sm:rounded-lg sm:px-6">
        <div class="flex flex-1 items-stretch overflow-hidden">
          <main class="flex-1 overflow-y-auto">
            <section aria-labelledby="primary-heading" class="flex h-full min-w-0 flex-1 flex-col lg:order-last">
              <h1 id="primary-heading" class="sr-only">member details</h1>
              <dl class="sm:divide-y sm:divide-gray-200">
                <div class="py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-3 sm:px-6">
                  <dt class="text-sm font-medium text-gray-500">Name</dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{{ memberStore.getMemberDetails?.fullName }}</dd>
                </div>
                <div class="py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-3 sm:px-6">
                  <dt class="text-sm font-medium text-gray-500">Member No.</dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{{ memberStore.getMemberDetails?.memberNumber }}</dd>
                </div>
                <div class="py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-3 sm:px-6">
                  <dt class="text-sm font-medium text-gray-500">ID No.</dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{{ memberStore.getMemberDetails?.idNumber }}</dd>
                </div>
                <div class="py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-3 sm:px-6">
                  <dt class="text-sm font-medium text-gray-500">Phone No.</dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{{ memberStore.getMemberDetails?.phoneNumber }}</dd>
                </div>
                <div class="py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-3 sm:px-6">
                  <dt class="text-sm font-medium text-gray-500">Email</dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{{ memberStore.getMemberDetails?.email }}</dd>
                </div>
                <div class="py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-3 sm:px-6">
                  <dt class="text-sm font-medium text-gray-500">Status</dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{{ memberStore.getMemberDetails?.memberStatus }}</dd>
                </div>
              </dl>
            </section>
          </main>
          <aside class="flex-1 overflow-y-auto border-l border-gray-200 bg-white block">
            <dl class="sm:divide-y sm:divide-gray-200">
              <div class="py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-3 sm:px-6">
                <dt class="text-sm font-medium text-gray-500">Total Shares</dt>
                <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{{ $filters.currencyKES(memberStore.getMemberDetails?.totalShares) }}</dd>
              </div>
              <div class="py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-3 sm:px-6">
                <dt class="text-sm font-medium text-gray-500">Total Deposits</dt>
                <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{{ $filters.currencyKES(memberStore.getMemberDetails?.totalDeposits) }}</dd>
              </div>
              <div class="py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-3 sm:px-6">
                <dt class="text-sm font-medium text-gray-500">Committed Amount</dt>
                <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{{ $filters.currencyKES(memberStore.getMemberDetails?.committedAmount) }}</dd>
              </div>
              <div class="py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-3 sm:px-6">
                <dt class="text-sm font-medium text-gray-500">Available Balance</dt>
                <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{{ $filters.currencyKES(memberStore.getMemberDetails?.availableAmount) }}</dd>
              </div>
              <div class="py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-3 sm:px-6">
                <dt class="text-sm font-medium text-gray-500">Last Updated</dt>
                <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{{ memberStore.getMemberDetails?.updated }}</dd>
              </div>
              <div class="py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-3 sm:px-6">
                <dt class="text-sm font-medium text-gray-500">Other Details</dt>
                <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  <button @click="otherDetails = !otherDetails" type="button" class="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-eg-lightblue focus:ring-offset-2 sm:text-sm">
                    Other Details
                    <ChevronDownIcon class="h-4 w-4 ml-2 text-gray-600"/>
                  </button>
                </dd>
              </div>
            </dl>
          </aside>
        </div>
        <Transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
          <div v-if="otherDetails" class="flex flex-1 items-stretch overflow-hidden">
            <main class="flex-1 overflow-y-auto">
              <section aria-labelledby="primary-heading" class="flex h-full min-w-0 flex-1 flex-col lg:order-last">
                <h1 id="primary-heading" class="sr-only">other details</h1>
                <dl class="sm:divide-y sm:divide-gray-200">
                  <div v-for="key in Object.keys(memberStore.getMemberDetails && memberStore.getMemberDetails.details ? memberStore.getMemberDetails.details : {})" class="py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-3 sm:px-6">
                    <dt class="text-sm font-medium text-gray-500">{{ key }}</dt>
                    <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{{ memberStore.getMemberDetails?.details[key]?.value }}</dd>
                  </div>
                </dl>
              </section>
            </main>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>
