<script setup lang="ts">
import Breadcrumb from "../../components/Breadcrumb.vue";
import {useRoute, useRouter} from "vue-router";
import {computed, onMounted, reactive, ref, watch} from "vue";
import {ChevronDownIcon, TrashIcon, PlusCircleIcon, CheckCircleIcon} from "@heroicons/vue/24/outline"
import stores from "../../stores";
const { memberStore, authStore } = stores;
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
  return Object.keys(form.details)
})

const currentLoans = computed(() => {
  return [
    /*{
      id: '1413',
      loanNo: '1413',
      member: '1413',
      date: new Date().toLocaleDateString(),
      committed: '1413',
      status: '1413'
    }*/
  ]
})

const guaranteedLoans = computed(() => {
  return [
    /*{
      id: '1413',
      loanNo: '1413',
      loanDate: new Date().toLocaleDateString(),
      loanType: '1413',
      amount: '1413',
      committed: '1413',
      paymentStatus: '1413',
      status: '1413'
    }*/
  ]
})

const witnessedLoans = computed(() => {
  return [
    /*{
      id: '1413',
      loanNo: '1413',
      member: '1413',
      date: new Date().toLocaleDateString(),
      status: '1413'
    }*/
  ]
})

const keyString = ref('')
const addingKey = ref(false)

const saveMemberDetails = () => {
  otherDetailsEdit.value = false
  memberStore.editMemberDetails({
    refId: `${route.params.refId}`,
    details: form.details
  }, `${route.params.refId}`).then(() => memberStore.fetchMember(`${route.params.refId}`)).then(() => authStore.defineNotification({
    id: (Math.random().toString(36) + Date.now().toString(36)).substring(2),
    message: `Member Details Updated`,
    success: true
  }))
}
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
            <form @submit.prevent="saveMemberDetails">
              <main class="flex-1 overflow-y-auto">
                <section aria-labelledby="primary-heading" class="flex h-full min-w-0 flex-1 flex-col lg:order-last">
                  <div class="flex">
                    <h6 class="py-2 sm:py-3 sm:px-6 font-medium text-base">Other details</h6>
                    <div class="flex items-center justify-center bg-white">
                      <button type="button" v-if="!otherDetailsEdit" @click="otherDetailsEdit = !otherDetailsEdit" class="inline-flex cursor-pointer items-center rounded-full bg-black py-0.5 px-2 text-xs font-medium text-white">
                        Edit
                      </button>
                      <button type="submit" v-if="otherDetailsEdit" class="inline-flex cursor-pointer items-center rounded-full bg-green-300 py-0.5 px-2 text-xs font-medium text-eg-bg">
                        Save
                      </button>
                    </div>
                  </div>
                  <dl class="sm:divide-y sm:divide-gray-200">
                    <TransitionGroup enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
                      <div v-for="(key, i) in memberDetails" :key="key+i" class="py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-3 sm:px-6">
                        <dt class="text-sm font-medium text-gray-500">
                          <div class="border-b border-gray-300 focus-within:border-eg-bgopacity">
                            <input disabled :value="key" type="text" class="block w-full border-0 border-b border-transparent bg-gray-200 cursor-not-allowed focus:ring-eg-lightblue focus:border-eg-bgopacity focus:ring-0 sm:text-sm" placeholder="key" />
                          </div>
                        </dt>
                        <dd class="mt-1 text-sm text-gray-900 sm:mt-0">
                          <div class="border-b border-gray-300 focus-within:border-eg-bgopacity mt-1 sm:mt-0">
                            <input :disabled="!otherDetailsEdit" required v-model="form.details[key].value" type="text" class="block w-full border-0 border-b border-transparent bg-gray-50 focus:ring-eg-lightblue focus:border-eg-bgopacity focus:ring-0 sm:text-sm" placeholder="value" />
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
                    <div v-if="addingKey" class="flex rounded-md shadow-sm max-w-xs">
                      <button :disabled="keyString === ''" @click="form.details[`${keyString}`] = { value: '', type: 'TEXT' };addingKey = !addingKey" type="button" class="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-green-50 px-3 text-gray-500 sm:text-sm hover:bg-green-100 focus:bg-green-200">
                        <CheckCircleIcon class="w-6 h-6" />
                      </button>
                      <input v-model="keyString" type="text" class="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 px-3 py-2 focus:border-eg-bg focus:ring-eg-bg sm:text-sm" placeholder="detail key" />
                    </div>
                    <button v-else type="button" @click="addingKey = !addingKey">
                      <PlusCircleIcon class="w-6 h-6" />
                    </button>
                  </div>
                </section>
              </main>
            </form>

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
            <th scope="col" class="whitespace-nowrap py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Loan No.</th>
            <th scope="col" class="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">Member</th>
            <th scope="col" class="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">Date</th>
            <th scope="col" class="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">Committed</th>
            <th scope="col" class="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
            <th scope="col" class="relative whitespace-nowrap py-3.5 pl-3 pr-4 sm:pr-6">
              <span class="sr-only">Action</span>
            </th>
          </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 bg-white">
          <tr v-for="loan in currentLoans" :key="loan.id">
            <td class="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-6">{{ loan.loanNo }}</td>
            <td class="whitespace-nowrap px-2 py-2 text-sm font-medium text-gray-900">{{ loan.member }}</td>
            <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-900">{{ loan.date }}</td>
            <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{{ loan.committed }}</td>
            <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{{ loan.status }}</td>
            <td class="relative whitespace-nowrap py-2 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
              <a href="#" class="text-eg-lightblue hover:text-eg-bg">
                View<span class="sr-only">, {{ loan.id }}</span>
              </a>
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
              <th scope="col" class="whitespace-nowrap py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Loan No.</th>
              <th scope="col" class="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">Member</th>
              <th scope="col" class="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">Date</th>
              <th scope="col" class="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
              <th scope="col" class="relative whitespace-nowrap py-3.5 pl-3 pr-4 sm:pr-6">
                <span class="sr-only">Action</span>
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 bg-white">
            <tr v-for="loan in witnessedLoans" :key="loan.id">
              <td class="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-6">{{ loan.loanNo }}</td>
              <td class="whitespace-nowrap px-2 py-2 text-sm font-medium text-gray-900">{{ loan.member }}</td>
              <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-900">{{ loan.date }}</td>
              <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{{ loan.status }}</td>
              <td class="relative whitespace-nowrap py-2 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                <a href="#" class="text-eg-lightblue hover:text-eg-bg">
                  View
                  <span class="sr-only">, {{ loan.id }}</span>
                </a>
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
            <th scope="col" class="whitespace-nowrap py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Loan No.</th>
            <th scope="col" class="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">Loan Date</th>
            <th scope="col" class="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">Loan Type</th>
            <th scope="col" class="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">Amount</th>
            <th scope="col" class="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">Committed</th>
            <th scope="col" class="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">Payment Status</th>
            <th scope="col" class="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
            <th scope="col" class="relative whitespace-nowrap py-3.5 pl-3 pr-4 sm:pr-6">
              <span class="sr-only">View</span>
            </th>
          </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 bg-white">
          <tr v-for="loan in guaranteedLoans" :key="loan.id">
            <td class="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-6">{{ loan.loanNo }}</td>
            <td class="whitespace-nowrap px-2 py-2 text-sm font-medium text-gray-900">{{ loan.loanDate }}</td>
            <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-900">{{ loan.loanType }}</td>
            <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{{ loan.amount }}</td>
            <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{{ loan.committed }}</td>
            <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{{ loan.paymentStatus }}</td>
            <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{{ loan.status }}</td>
            <td class="relative whitespace-nowrap py-2 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
              <a href="#" class="text-eg-lightblue hover:text-eg-bg"
              >View<span class="sr-only">, {{ loan.id }}</span></a
              >
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
