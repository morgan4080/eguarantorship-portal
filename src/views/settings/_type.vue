<script setup lang="ts">
  import {useRoute, useRouter} from "vue-router";
  import stores from "../../stores";
  import {computed, onMounted, reactive, watch} from "vue";
  import Breadcrumb from "../../components/Breadcrumb.vue";
  import {required} from "@vuelidate/validators";
  import useVuelidate from "@vuelidate/core";
  import {FolderPlusIcon, ChevronDownIcon} from "@heroicons/vue/20/solid";
  import DropDown from "../../components/DropDown.vue";
  import {MenuButton} from "@headlessui/vue";
  import {EllipsisVerticalIcon, PencilIcon, TrashIcon} from "@heroicons/vue/20/solid";
  import Paginator from "../../components/Paginator.vue";
  const route = useRoute()
  const router = useRouter()
  const { zohoStore, authStore, loanProductStore, clientStore } = stores

  const zohoIntegrationForm = reactive({
    clientId: '',
    clientSecret: '',
    code: '',
    refreshToken: ''
  })

  const zohoIntegrationValidationRules = {
    clientId: {
      required,
    },
    clientSecret: {
      required,
    },
    code: {
      required,
    },
    refreshToken: {
      required,
    },
  }

  const v$ = useVuelidate(zohoIntegrationValidationRules, zohoIntegrationForm, { $lazy: true, $autoDirty: true});

  const filters = reactive({
    recordsPerPage: 10,
    searchTerm: '',
    order: 'ASC',
    page: 1
  })

  const query = computed(() => {
    // &pageIndex=${filters.page}
    return (`?order=${filters.order}&pageSize=${filters.recordsPerPage}&includeInActive=false`)
  })

  onMounted(async () => {
    if (route.params.type === 'zoho-integration') {
      const [zohoCredentialsStatus] = await Promise.allSettled([
        zohoStore.fetchZohoCredentials()
      ])
      if (zohoCredentialsStatus.status === 'fulfilled' && zohoStore.getZohoDetails) {
        zohoIntegrationForm.clientId = zohoStore.getZohoDetails.clientId;
        zohoIntegrationForm.clientSecret = zohoStore.getZohoDetails.clientSecret;
        zohoIntegrationForm.code = zohoStore.getZohoDetails.code;
        zohoIntegrationForm.refreshToken = zohoStore.getZohoDetails.refreshToken;
      }
    }

    if (route.params.type === 'loan-products') {
      await Promise.allSettled([
        loanProductStore.fetchLoanProducts(query.value)
      ])
    }

    if (route.params.type === 'client-settings') {
      const [clientSettings] = await Promise.allSettled([
        clientStore.fetchClientSettings()
      ])
      if (clientSettings.status === 'fulfilled' && clientStore.getClientSettings) {
        organisationSettingsForm.organizationName = clientStore.getClientSettings.organizationName
        organisationSettingsForm.ussdShortCode = clientStore.getClientSettings.ussdShortCode
      }
    }
  })

  watch(() => route.params.type, async (type) => {
    if (type === 'zoho-integration') {
      const [zohoCredentialsStatus] = await Promise.allSettled([
        zohoStore.fetchZohoCredentials()
      ])
      if (zohoCredentialsStatus.status === 'fulfilled' && zohoStore.getZohoDetails) {
        zohoIntegrationForm.clientId = zohoStore.getZohoDetails.clientId;
        zohoIntegrationForm.clientSecret = zohoStore.getZohoDetails.clientSecret;
        zohoIntegrationForm.code = zohoStore.getZohoDetails.code;
        zohoIntegrationForm.refreshToken = zohoStore.getZohoDetails.refreshToken;
      }
    }

    if (type === 'loan-products') {
      await Promise.allSettled([
        loanProductStore.fetchLoanProducts(query.value)
      ])
    }
    if (type === 'client-settings') {
      const [clientSettings] = await Promise.allSettled([
        clientStore.fetchClientSettings()
      ])
      if (clientSettings.status === 'fulfilled' && clientStore.getClientSettings) {
        organisationSettingsForm.organizationName = clientStore.getClientSettings.organizationName
        organisationSettingsForm.ussdShortCode = clientStore.getClientSettings.ussdShortCode
      }
    }
  })

  const submitZohoCredentials = async () => {
    const result = await v$.value.$validate()

    if (result) {
      const payload = {
        clientId: zohoIntegrationForm.clientId,
        clientSecret: zohoIntegrationForm.clientSecret,
        code: zohoIntegrationForm.code,
        refreshToken: zohoIntegrationForm.refreshToken
      }

      zohoStore.submitCredentials(payload).then(() => authStore.defineNotification({
        id: (Math.random().toString(36) + Date.now().toString(36)).substring(2),
        message: `Zoho Credentials Created`,
        success: true
      }))
    }
  }

  const actions = [
    {
      id: 1,
      name: 'Create Loan Product',
      icon: FolderPlusIcon,
      href: '/settings/loan-products/create'
    },
  ]

  const deleteLoanProduct = (refId: string) => {
    if (confirm('Are you sure you want to delete this loan product?')) {
      loanProductStore.deleteLoanProduct(refId).then(() => loanProductStore.fetchLoanProducts(query.value)).then(() => authStore.defineNotification({
        id: (Math.random().toString(36) + Date.now().toString(36)).substring(2),
        message: `Loan Product Deleted`,
        success: true
      }))
    }
  }



  const organisationSettingsForm = reactive({
    organizationName: '',
    ussdShortCode: ''
  })

  const organisationSettingsFormValidationRules = {
    organizationName: {
      required,
    },
    ussdShortCode: {
      required,
    },
  }

  const x$ = useVuelidate(organisationSettingsFormValidationRules, organisationSettingsForm, { $lazy: true, $autoDirty: true});

  const submitOrganisationSettings = async () => {

    const result = await x$.value.$validate()

    if (result) {
      console.log(organisationSettingsForm)
      clientStore.postClientSettings(organisationSettingsForm).then(() => clientStore.fetchClientSettings()).then(() => authStore.defineNotification({
        id: (Math.random().toString(36) + Date.now().toString(36)).substring(2),
        message: `Client Settings Saved.`,
        success: true
      }))
    }

  }

  const refreshNext = async (cP: number) => {
    filters.page = cP + 1;
    await Promise.allSettled([
      loanProductStore.fetchLoanProducts(query.value)
    ])
  }
  const refreshPrev = async (cP: number) => {
    filters.page = cP - 1;
    await Promise.allSettled([
      loanProductStore.fetchLoanProducts(query.value)
    ])
  }
  const refreshCurrent = async () => {
    await Promise.allSettled([
      loanProductStore.fetchLoanProducts(query.value)
    ])
  }

</script>
<template>
  <div v-if="route.params.type === 'zoho-integration'" class="overflow-hidden w-full pt-16 pb-32">
    <div class="space-y-6 sm:px-6 lg:px-5">
      <div class="flex justify-between items-center">
        <Breadcrumb pageName="" linkName="Settings Information" linkUrl="/settings"  current="Zoho Integration"/>
      </div>
      <form @submit.prevent="submitZohoCredentials">
        <div class="shadow sm:overflow-hidden sm:rounded-md">
          <div class="space-y-6 bg-white py-6 px-4 sm:p-6">
            <div>
              <h3 class="text-lg font-medium leading-6 text-gray-900">Zoho Integration</h3>
              <p class="mt-1 text-sm text-gray-500">Client credentials zoho.</p>
            </div>

            <div class="grid grid-cols-6 gap-6">
              <div class="col-span-6">
                <label for="first-name" class="block text-sm font-medium text-gray-700">Client ID</label>
                <input v-model="zohoIntegrationForm.clientId" type="text" name="first-name" id="first-name" class="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-bg-eg focus:outline-none focus:ring-bg-eg sm:text-sm" />
                <div class="input-errors" v-for="(error, index) of v$.clientId.$errors" :key="index">
                  <div class="text-xs text-red-400">{{ error.$message }}</div>
                </div>
              </div>

              <div class="col-span-6">
                <label for="last-name" class="block text-sm font-medium text-gray-700">Client Secret</label>
                <input v-model="zohoIntegrationForm.clientSecret" type="text" name="last-name" id="last-name" class="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-bg-eg focus:outline-none focus:ring-bg-eg sm:text-sm" />
                <div class="input-errors" v-for="(error, index) of v$.clientSecret.$errors" :key="index">
                  <div class="text-xs text-red-400">{{ error.$message }}</div>
                </div>
              </div>

              <div class="col-span-6">
                <label for="last-name" class="block text-sm font-medium text-gray-700">Code</label>
                <input v-model="zohoIntegrationForm.code" type="text" name="last-name" id="last-name" class="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-bg-eg focus:outline-none focus:ring-bg-eg sm:text-sm" />
                <div class="input-errors" v-for="(error, index) of v$.code.$errors" :key="index">
                  <div class="text-xs text-red-400">{{ error.$message }}</div>
                </div>
              </div>

              <div class="col-span-6">
                <label for="last-name" class="block text-sm font-medium text-gray-700">Refresh Token</label>
                <input v-model="zohoIntegrationForm.refreshToken" type="text" name="last-name" id="last-name" class="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-bg-eg focus:outline-none focus:ring-bg-eg sm:text-sm" />
                <div class="input-errors" v-for="(error, index) of v$.refreshToken.$errors" :key="index">
                  <div class="text-xs text-red-400">{{ error.$message }}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 text-right sm:px-6 space-x-4">
            <button @click="router.push('/settings')" :disabled="authStore.getLoadingState" type="button" class="inline-flex justify-center rounded-md border border-transparent bg-red-300 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2">Cancel</button>
            <button :disabled="authStore.getLoadingState" type="submit" class="inline-flex justify-center rounded-md border border-transparent bg-eg-bg py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-eg-lightblue focus:outline-none focus:ring-2 focus:ring-eg-lightblue focus:ring-offset-2">Save</button>
          </div>
        </div>
      </form>
    </div>
  </div>
  <div v-if="route.params.type === 'loan-products'" class="overflow-hidden w-full pt-16 pb-32">
    <div class="space-y-6 sm:px-6 lg:px-5">
      <div class="flex justify-between items-center">
        <Breadcrumb pageName="" linkName="Settings Information" linkUrl="/settings"  current="Loan Products"/>
        <DropDown :items="actions">
          <MenuButton class="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-2 py-1 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-eg-bg focus:ring-offset-2 focus:ring-offset-gray-100">
            Actions
            <ChevronDownIcon class="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
          </MenuButton>
        </DropDown>
      </div>
      <div class="bg-white px-4 py-5 shadow sm:rounded-lg sm:px-6">
        <div class="px-4 py-5 sm:px-6">
          <h3 class="text-lg font-medium leading-6 text-gray-900">Loan Products</h3>
          <p class="mt-1 max-w-2xl text-sm text-gray-500">Configured loan products for the organisation.</p>
        </div>
        <table class="min-w-full">
          <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="whitespace-nowrap py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Loan Name</th>
            <th scope="col" class="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">Period</th>
            <th scope="col" class="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">Required Guarantors</th>
            <th scope="col" class="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">Interest Rate</th>
            <th scope="col" class="relative whitespace-nowrap py-3.5 pl-3 pr-4 sm:pr-6">
              <span class="sr-only">Action</span>
            </th>
          </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 bg-white">
          <tr v-for="loan in loanProductStore.getLoanProducts" :key="loan.refId">
            <td class="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-6">{{ loan.name }}</td>
            <td class="whitespace-nowrap px-2 py-2 text-sm font-medium text-gray-900">{{ loan.maxPeriod }}</td>
            <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-900">{{ loan.requiredGuarantors }}</td>
            <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{{ loan.interestRate }}</td>
            <td class="relative whitespace-nowrap py-2 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
              <DropDown :items="[
                {
                  id: 1,
                  name: 'Edit',
                  icon: PencilIcon,
                  href: `/settings/loan-products/${loan.refId}/edit`
                },
                {
                  id: 2,
                  name: 'Delete',
                  icon: TrashIcon,
                  button: true,
                  callback: deleteLoanProduct,
                  refId: loan.refId
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
      <Paginator
          :current-page="filters.page"
          :filter-form="filters"
          @refreshNext="refreshNext"
          @refreshPrev="refreshPrev"
          @refreshCurrent="refreshCurrent"
          :total-pages="loanProductStore.getPaginationData ? loanProductStore.getPaginationData.totalPages : 0"
          :total-elements="loanProductStore.getPaginationData ? loanProductStore.getPaginationData.totalElements : 0"
      />
    </div>
  </div>
  <div v-if="route.params.type === 'client-settings'" class="overflow-hidden w-full pt-16 pb-32">
    <div class="space-y-6 sm:px-6 lg:px-5">
      <div class="flex justify-between items-center">
        <Breadcrumb pageName="" linkName="Settings Information" linkUrl="/settings"  current="Organisation Details"/>
      </div>
      <form @submit.prevent="submitOrganisationSettings">
        <div class="shadow sm:overflow-hidden sm:rounded-md">
          <div class="space-y-6 bg-white py-6 px-4 sm:p-6">
            <div>
              <h3 class="text-lg font-medium leading-6 text-gray-900">Organisation Details</h3>
              <p class="mt-1 text-sm text-gray-500">Organisation settings</p>
            </div>

            <div class="grid grid-cols-6 gap-6">
              <div class="col-span-6">
                <label for="organizationName" class="block text-sm font-medium text-gray-700">Organization</label>
                <input v-model="organisationSettingsForm.organizationName" type="text" id="organizationName" class="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-bg-eg focus:outline-none focus:ring-bg-eg sm:text-sm" />
                <div class="input-errors" v-for="(error, index) of x$.organizationName.$errors" :key="index">
                  <div class="text-xs text-red-400">{{ error.$message }}</div>
                </div>
              </div>

              <div class="col-span-6">
                <label for="ussdShortCode" class="block text-sm font-medium text-gray-700">USSD Shortcode</label>
                <input v-model="organisationSettingsForm.ussdShortCode" type="text" id="ussdShortCode" class="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-bg-eg focus:outline-none focus:ring-bg-eg sm:text-sm" />
                <div class="input-errors" v-for="(error, index) of x$.ussdShortCode.$errors" :key="index">
                  <div class="text-xs text-red-400">{{ error.$message }}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 text-right sm:px-6 space-x-4">
            <button @click="router.push('/settings')" :disabled="authStore.getLoadingState" type="button" class="inline-flex justify-center rounded-md border border-transparent bg-red-300 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2">Cancel</button>
            <button :disabled="authStore.getLoadingState" type="submit" class="inline-flex justify-center rounded-md border border-transparent bg-eg-bg py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-eg-lightblue focus:outline-none focus:ring-2 focus:ring-eg-lightblue focus:ring-offset-2">Save</button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
