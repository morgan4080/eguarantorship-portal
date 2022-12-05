<script setup lang="ts">
import Breadcrumb from "../../components/Breadcrumb.vue";
import {useRoute, useRouter} from "vue-router";
import {computed, onMounted, reactive, ref, watch} from "vue";
import {ChevronDownIcon, TrashIcon, PlusCircleIcon} from "@heroicons/vue/24/outline"
import stores from "../../stores";
const { memberStore } = stores;
const router = useRouter();
const route = useRoute();
onMounted(async () => {
  await Promise.all([
    memberStore.fetchMember(`${route.params.refId}`)
  ])
})
const form = reactive({
  details: {}
})
const otherDetails = ref<boolean>(false)
const otherDetailsEdit = ref<boolean>(false)
const memberDetails = computed(() => {
  if (memberStore.getMemberDetails && memberStore.getMemberDetails.details) {
    form.details = memberStore.getMemberDetails.details
  }
  return Object.keys(memberStore.getMemberDetails && memberStore.getMemberDetails.details ? memberStore.getMemberDetails.details : {})
})
const saveMemberDetails = () => {
  otherDetailsEdit.value = !otherDetailsEdit.value
}
watch(form, () => {
  console.log(form)
})
const transactions = [
  {
    id: 'AAPS0L',
    company: 'Chase & Co.',
    share: 'CAC',
    commission: '+$4.37',
    price: '$3,509.00',
    quantity: '12.00',
    netAmount: '$4,397.00',
  },
  // More transactions...
]
</script>
<template>
  <div class="w-full pt-16 pb-32">
    <div class="space-y-6 sm:px-6 lg:px-5">
      <div class="flex justify-between items-center">
        <Breadcrumb pageName="" linkName="All Members" linkUrl="/members"  :current="`Member ${memberStore.getMemberDetails?.memberNumber}`"/>
      </div>
      <div class="bg-white px-4 py-5 shadow sm:rounded-lg sm:px-6">
        <div class="px-4 py-5 sm:px-6">
          <h3 class="text-lg font-medium leading-6 text-gray-900">Member Details</h3>
          <p class="mt-1 max-w-2xl text-sm text-gray-500">Member {{memberStore.getMemberDetails?.memberNumber}} current data.</p>
        </div>
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
                <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{{ memberStore.getMemberDetails ? $filters.currencyKES(memberStore.getMemberDetails?.totalShares) : 0 }}</dd>
              </div>
              <div class="py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-3 sm:px-6">
                <dt class="text-sm font-medium text-gray-500">Total Deposits</dt>
                <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{{ memberStore.getMemberDetails ? $filters.currencyKES(memberStore.getMemberDetails?.totalDeposits) : 0 }}</dd>
              </div>
              <div class="py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-3 sm:px-6">
                <dt class="text-sm font-medium text-gray-500">Committed Amount</dt>
                <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{{ memberStore.getMemberDetails ? $filters.currencyKES(memberStore.getMemberDetails?.committedAmount) : 0 }}</dd>
              </div>
              <div class="py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-3 sm:px-6">
                <dt class="text-sm font-medium text-gray-500">Available Balance</dt>
                <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{{ memberStore.getMemberDetails ? $filters.currencyKES(memberStore.getMemberDetails?.availableAmount) : 0 }}</dd>
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
                <div class="flex">
                  <h6 class="py-2 sm:py-3 sm:px-6 font-medium text-base">Other details</h6>
                  <div class="flex items-center justify-center bg-white">
                    <span v-if="!otherDetailsEdit" @click="otherDetailsEdit = !otherDetailsEdit" class="inline-flex cursor-pointer items-center rounded-full bg-black py-0.5 px-2 text-xs font-medium text-white">
                      Edit
                    </span>
                    <span v-if="otherDetailsEdit" @click="saveMemberDetails" class="inline-flex cursor-pointer items-center rounded-full bg-green-300 py-0.5 px-2 text-xs font-medium text-eg-bg">
                      Save
                    </span>
                  </div>
                </div>
                <dl class="sm:divide-y sm:divide-gray-200">
                  <TransitionGroup enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
                    <div v-for="(key, i) in memberDetails" :key="key+i" class="py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-3 sm:px-6">
                      <dt class="text-sm font-medium text-gray-500">
                        <span v-if="!otherDetailsEdit">{{ key }}</span>

                        <div v-else class="border-b border-gray-300 focus-within:border-eg-bgopacity">
                          <input disabled :value="key" type="text" class="block w-full border-0 border-b border-transparent bg-gray-200 cursor-not-allowed focus:ring-eg-lightblue focus:border-eg-bgopacity focus:ring-0 sm:text-sm" placeholder="key" />
                        </div>
                      </dt>
                      <dd class="mt-1 text-sm text-gray-900 sm:mt-0">
                        <span v-if="!otherDetailsEdit">{{ memberStore.getMemberDetails?.details[key]?.value }}</span>

                        <div v-else class="border-b border-gray-300 focus-within:border-eg-bgopacity mt-1 sm:mt-0">
                          <input v-model="form.details[key].value" type="text" class="block w-full border-0 border-b border-transparent bg-gray-50 focus:ring-eg-lightblue focus:border-eg-bgopacity focus:ring-0 sm:text-sm" placeholder="value" />
                        </div>
                      </dd>
                      <dd v-if="otherDetailsEdit" class="mt-1 text-sm text-gray-900 sm:mt-0">
                        <button type="button" @click="delete form.details[key]">
                          <TrashIcon class="w-4 h-4" />
                        </button>
                      </dd>
                    </div>
                  </TransitionGroup>
                </dl>
                <div v-if="otherDetailsEdit" class="sm:divide-y sm:divide-gray-200 py-2 sm:py-3 sm:px-6">
                  <button type="button" @click="form.details[`key${Object.keys(form.details).length + 1}`] = { value: '', type: 'TEXT' }">
                    <PlusCircleIcon class="w-6 h-6" />
                  </button>
                </div>
              </section>
            </main>
          </div>
        </Transition>
      </div>

      <div class="bg-white px-4 py-5 shadow sm:rounded-lg sm:px-6">
        <div class="px-4 py-5 sm:px-6">
          <h3 class="text-lg font-medium leading-6 text-gray-900">Current Loans</h3>
          <p class="mt-1 max-w-2xl text-sm text-gray-500">Members' current loan requests.</p>
        </div>
        <table class="min-w-full divide-y divide-gray-300">
          <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="whitespace-nowrap py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Transaction ID</th>
            <th scope="col" class="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">Company</th>
            <th scope="col" class="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">Share</th>
            <th scope="col" class="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">Commision</th>
            <th scope="col" class="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">Price</th>
            <th scope="col" class="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">Quantity</th>
            <th scope="col" class="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">Net amount</th>
            <th scope="col" class="relative whitespace-nowrap py-3.5 pl-3 pr-4 sm:pr-6">
              <span class="sr-only">View</span>
            </th>
          </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 bg-white">
          <tr v-for="transaction in transactions" :key="transaction.id">
            <td class="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-6">{{ transaction.id }}</td>
            <td class="whitespace-nowrap px-2 py-2 text-sm font-medium text-gray-900">{{ transaction.company }}</td>
            <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-900">{{ transaction.share }}</td>
            <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{{ transaction.commission }}</td>
            <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{{ transaction.price }}</td>
            <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{{ transaction.quantity }}</td>
            <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{{ transaction.netAmount }}</td>
            <td class="relative whitespace-nowrap py-2 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
              <a href="#" class="text-eg-lightblue hover:text-eg-bg"
              >View<span class="sr-only">, {{ transaction.id }}</span></a
              >
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <div class="bg-white px-4 py-5 shadow sm:rounded-lg sm:px-6">
        <div class="px-4 py-5 sm:px-6">
          <h3 class="text-lg font-medium leading-6 text-gray-900">Witnessed Loans</h3>
          <p class="mt-1 max-w-2xl text-sm text-gray-500">Loans requests witnessed by member.</p>
        </div>
        <table class="min-w-full divide-y divide-gray-300">
          <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="whitespace-nowrap py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Transaction ID</th>
            <th scope="col" class="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">Company</th>
            <th scope="col" class="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">Share</th>
            <th scope="col" class="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">Commision</th>
            <th scope="col" class="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">Price</th>
            <th scope="col" class="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">Quantity</th>
            <th scope="col" class="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">Net amount</th>
            <th scope="col" class="relative whitespace-nowrap py-3.5 pl-3 pr-4 sm:pr-6">
              <span class="sr-only">View</span>
            </th>
          </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 bg-white">
          <tr v-for="transaction in transactions" :key="transaction.id">
            <td class="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-6">{{ transaction.id }}</td>
            <td class="whitespace-nowrap px-2 py-2 text-sm font-medium text-gray-900">{{ transaction.company }}</td>
            <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-900">{{ transaction.share }}</td>
            <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{{ transaction.commission }}</td>
            <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{{ transaction.price }}</td>
            <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{{ transaction.quantity }}</td>
            <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{{ transaction.netAmount }}</td>
            <td class="relative whitespace-nowrap py-2 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
              <a href="#" class="text-eg-lightblue hover:text-eg-bg"
              >View<span class="sr-only">, {{ transaction.id }}</span></a
              >
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <div class="bg-white px-4 py-5 shadow sm:rounded-lg sm:px-6">
        <div class="px-4 py-5 sm:px-6">
          <h3 class="text-lg font-medium leading-6 text-gray-900">Guaranteed Loans</h3>
          <p class="mt-1 max-w-2xl text-sm text-gray-500">Loans requests guaranteed by member.</p>
        </div>
        <table class="min-w-full divide-y divide-gray-300">
          <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="whitespace-nowrap py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Transaction ID</th>
            <th scope="col" class="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">Company</th>
            <th scope="col" class="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">Share</th>
            <th scope="col" class="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">Commision</th>
            <th scope="col" class="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">Price</th>
            <th scope="col" class="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">Quantity</th>
            <th scope="col" class="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">Net amount</th>
            <th scope="col" class="relative whitespace-nowrap py-3.5 pl-3 pr-4 sm:pr-6">
              <span class="sr-only">View</span>
            </th>
          </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 bg-white">
          <tr v-for="transaction in transactions" :key="transaction.id">
            <td class="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-6">{{ transaction.id }}</td>
            <td class="whitespace-nowrap px-2 py-2 text-sm font-medium text-gray-900">{{ transaction.company }}</td>
            <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-900">{{ transaction.share }}</td>
            <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{{ transaction.commission }}</td>
            <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{{ transaction.price }}</td>
            <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{{ transaction.quantity }}</td>
            <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{{ transaction.netAmount }}</td>
            <td class="relative whitespace-nowrap py-2 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
              <a href="#" class="text-eg-lightblue hover:text-eg-bg"
              >View<span class="sr-only">, {{ transaction.id }}</span></a
              >
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
