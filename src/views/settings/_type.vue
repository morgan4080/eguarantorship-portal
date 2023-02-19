<script setup lang="ts">
  import {ChevronDownIcon, PlusCircleIcon, CheckCircleIcon} from "@heroicons/vue/24/outline"
  import {useRoute, useRouter} from "vue-router";
  import stores from "../../stores";
  import {computed, onMounted, reactive, ref, watch} from "vue";
  import Breadcrumb from "../../components/Breadcrumb.vue";
  import {email, required} from "@vuelidate/validators";
  import useVuelidate from "@vuelidate/core";
  import DropDown from "../../components/DropDown.vue";
  import {MenuButton} from "@headlessui/vue";
  import {FolderPlusIcon,EllipsisVerticalIcon, PencilIcon, TrashIcon} from "@heroicons/vue/20/solid";
  import Paginator from "../../components/Paginator.vue";
  import {SettingsPayloadType} from "../../stores/client-settings-store";
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
        organisationSettingsForm.organizationName = clientStore.getClientSettings.organizationName ? clientStore.getClientSettings.organizationName : ''
        organisationSettingsForm.ussdShortCode = clientStore.getClientSettings.ussdShortCode ? clientStore.getClientSettings.ussdShortCode : ''
        organisationSettingsForm.organizationAlias= clientStore.getClientSettings.organizationAlias ? clientStore.getClientSettings.organizationAlias : ''
        organisationSettingsForm.organizationEmail= clientStore.getClientSettings.organizationEmail ? clientStore.getClientSettings.organizationEmail : ''
        organisationSettingsForm.supportEmail=  clientStore.getClientSettings.supportEmail ? clientStore.getClientSettings.supportEmail : ''
        organisationSettingsForm.organizationPrimaryTheme = clientStore.getClientSettings.organizationPrimaryTheme ? clientStore.getClientSettings.organizationPrimaryTheme : '#ffff00'
        organisationSettingsForm.organizationSecondaryTheme = clientStore.getClientSettings.organizationSecondaryTheme ? clientStore.getClientSettings.organizationSecondaryTheme : '#0000ff'
        organisationSettingsForm.organizationLogoName=  clientStore.getClientSettings.organizationLogoName ? clientStore.getClientSettings.organizationLogoName : ''
        organisationSettingsForm.organizationLogoExtension=  clientStore.getClientSettings.organizationLogoExtension ? clientStore.getClientSettings.organizationLogoExtension : ''
        organisationSettingsForm.loanProductMaxPeriod=  clientStore.getClientSettings.loanProductMaxPeriod ? clientStore.getClientSettings.loanProductMaxPeriod : ''
        organisationSettingsForm.coreBankingIntegration =  clientStore.getClientSettings.coreBankingIntegration ? clientStore.getClientSettings.coreBankingIntegration : 'DEFAULT'
        organisationSettingsForm.notificationProvider =  clientStore.getClientSettings.notificationProvider ? clientStore.getClientSettings.notificationProvider : 'DEFAULT'
        organisationSettingsForm.identifierType =  clientStore.getClientSettings.identifierType ? clientStore.getClientSettings.identifierType : 'PHONE_NUMBER'
        organisationSettingsForm.parallelLoans =  typeof clientStore.getClientSettings.parallelLoans === 'boolean' ? clientStore.getClientSettings.parallelLoans : false
        organisationSettingsForm.requireWitness =  typeof clientStore.getClientSettings.requireWitness === 'boolean' ? clientStore.getClientSettings.requireWitness : false
        organisationSettingsForm.allowZeroGuarantors =  typeof clientStore.getClientSettings.allowZeroGuarantors === 'boolean' ? clientStore.getClientSettings.allowZeroGuarantors : false
        organisationSettingsForm.allowSelfGuarantee =  typeof clientStore.getClientSettings.allowSelfGuarantee === 'boolean' ? clientStore.getClientSettings.allowSelfGuarantee : false
        organisationSettingsForm.isGuaranteedAmountShared =  typeof clientStore.getClientSettings.isGuaranteedAmountShared === 'boolean' ? clientStore.getClientSettings.isGuaranteedAmountShared : false
        organisationSettingsForm.useEmbeddedURL =  typeof clientStore.getClientSettings.useEmbeddedURL === 'boolean' ? clientStore.getClientSettings.useEmbeddedURL : true
        organisationSettingsForm.containsAttachments =  typeof clientStore.getClientSettings.containsAttachments === 'boolean' ? clientStore.getClientSettings.containsAttachments : false
        organisationSettingsForm.customSMS =  typeof clientStore.getClientSettings.customSMS === 'boolean' ? clientStore.getClientSettings.customSMS : false
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
        organisationSettingsForm.organizationName = clientStore.getClientSettings.organizationName ? clientStore.getClientSettings.organizationName : ''
        organisationSettingsForm.ussdShortCode = clientStore.getClientSettings.ussdShortCode ? clientStore.getClientSettings.ussdShortCode : ''
        organisationSettingsForm.organizationAlias= clientStore.getClientSettings.organizationAlias ? clientStore.getClientSettings.organizationAlias : ''
        organisationSettingsForm.organizationEmail= clientStore.getClientSettings.organizationEmail ? clientStore.getClientSettings.organizationEmail : ''
        organisationSettingsForm.supportEmail=  clientStore.getClientSettings.supportEmail ? clientStore.getClientSettings.supportEmail : ''
        organisationSettingsForm.organizationPrimaryTheme = clientStore.getClientSettings.organizationPrimaryTheme ? clientStore.getClientSettings.organizationPrimaryTheme : '#ffff00'
        organisationSettingsForm.organizationSecondaryTheme = clientStore.getClientSettings.organizationSecondaryTheme ? clientStore.getClientSettings.organizationSecondaryTheme : '#0000ff'
        organisationSettingsForm.organizationLogoName=  clientStore.getClientSettings.organizationLogoName ? clientStore.getClientSettings.organizationLogoName : ''
        organisationSettingsForm.organizationLogoExtension=  clientStore.getClientSettings.organizationLogoExtension ? clientStore.getClientSettings.organizationLogoExtension : ''
        organisationSettingsForm.loanProductMaxPeriod=  clientStore.getClientSettings.loanProductMaxPeriod ? clientStore.getClientSettings.loanProductMaxPeriod : ''
        organisationSettingsForm.coreBankingIntegration =  clientStore.getClientSettings.coreBankingIntegration ? clientStore.getClientSettings.coreBankingIntegration : 'DEFAULT'
        organisationSettingsForm.notificationProvider =  clientStore.getClientSettings.notificationProvider ? clientStore.getClientSettings.notificationProvider : 'DEFAULT'
        organisationSettingsForm.identifierType =  clientStore.getClientSettings.identifierType ? clientStore.getClientSettings.identifierType : 'PHONE_NUMBER'
        organisationSettingsForm.parallelLoans =  typeof clientStore.getClientSettings.parallelLoans === 'boolean' ? clientStore.getClientSettings.parallelLoans : false
        organisationSettingsForm.requireWitness =  typeof clientStore.getClientSettings.requireWitness === 'boolean' ? clientStore.getClientSettings.requireWitness : false
        organisationSettingsForm.allowZeroGuarantors =  typeof clientStore.getClientSettings.allowZeroGuarantors === 'boolean' ? clientStore.getClientSettings.allowZeroGuarantors : false
        organisationSettingsForm.allowSelfGuarantee =  typeof clientStore.getClientSettings.allowSelfGuarantee === 'boolean' ? clientStore.getClientSettings.allowSelfGuarantee : false
        organisationSettingsForm.isGuaranteedAmountShared =  typeof clientStore.getClientSettings.isGuaranteedAmountShared === 'boolean' ? clientStore.getClientSettings.isGuaranteedAmountShared : false
        organisationSettingsForm.useEmbeddedURL =  typeof clientStore.getClientSettings.useEmbeddedURL === 'boolean' ? clientStore.getClientSettings.useEmbeddedURL : true
        organisationSettingsForm.containsAttachments =  typeof clientStore.getClientSettings.containsAttachments === 'boolean' ? clientStore.getClientSettings.containsAttachments : false
        organisationSettingsForm.customSMS =  typeof clientStore.getClientSettings.customSMS === 'boolean' ? clientStore.getClientSettings.customSMS : false
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

    location.reload();
  }

  const keyString = ref('')

  const addingKey = ref(false)

  const otherDetails = ref<boolean>(false)

  const otherDetailsEdit = ref<boolean>(false)

  const organisationSettingsForm = reactive<SettingsPayloadType>({
    organizationName: '',
    ussdShortCode: '',
    organizationAlias: '',
    organizationEmail: '',
    supportEmail: '',
    organizationPrimaryTheme: '#ffff00',
    organizationSecondaryTheme: '#0000ff',
    organizationLogoName: '',
    organizationLogoExtension: '',
    loanProductMaxPeriod: '',
    coreBankingIntegration: 'DEFAULT',
    notificationProvider: 'DEFAULT',
    identifierType: 'PHONE_NUMBER',
    parallelLoans: false,
    requireWitness: false,
    allowZeroGuarantors: false,
    allowSelfGuarantee: false,
    isGuaranteedAmountShared: false,
    useEmbeddedURL: true,
    containsAttachments: false,
    customSMS: false,
    details: {}
  })

  const organisationDetails = computed(() => {
    if (clientStore.getClientSettings && clientStore.getClientSettings.details) {
      organisationSettingsForm.details = clientStore.getClientSettings.details
    }
    return Object.keys(organisationSettingsForm.details)
  })

  const organisationSettingsFormValidationRules = {
    organizationName: {
      required,
    },
    ussdShortCode: {
      required,
    },
    organizationAlias: {
      required,
    },
    organizationEmail: {
      required,
      email
    },
    supportEmail: {
      required,
      email
    },
    organizationPrimaryTheme: {
      required,
    },
    organizationSecondaryTheme: {
      required,
    },
    organizationLogoName: {
      required,
    },
    organizationLogoExtension: {
      required,
    },
    loanProductMaxPeriod: {
      required,
    },
    coreBankingIntegration: {
      required,
    },
    notificationProvider: {
        required,
    },
    identifierType: {
      required,
    },
    parallelLoans: {
      required,
    },
    requireWitness: {
      required,
    },
    allowZeroGuarantors: {
      required,
    },
    allowSelfGuarantee: {
      required,
    },
    isGuaranteedAmountShared: {
      required,
    },
    useEmbeddedURL: {
      required,
    },
    containsAttachments: {
      required,
    },
    customSMS: {
      required,
    },
  }

  const x$ = useVuelidate(organisationSettingsFormValidationRules, organisationSettingsForm, { $lazy: true, $autoDirty: true});

  const submitOrganisationSettings = async () => {

    const result = await x$.value.$validate()

    if (result) {
      clientStore.postClientSettings(organisationSettingsForm)
      .then(() => clientStore.fetchClientSettings())
      .then(() => authStore.defineNotification({
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
  <div v-if="route.params.type === 'zoho-integration'" class="flex flex-1 flex-col">
    <main class="flex-1">
      <div class="pt-2 pb-16">
        <div class="mx-auto space-y-6 sm:px-6 lg:px-5">
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
    </main>
  </div>
  <div v-if="route.params.type === 'loan-products'" class="flex flex-1 flex-col">
    <main class="flex-1">
      <div class="pt-2 pb-16">
        <div class="mx-auto space-y-6 sm:px-6 lg:px-5">
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
            <h3 class="text-lg font-medium leading-6 text-gray-900">Loan Products</h3>
            <p class="mt-1 max-w-2xl text-sm text-gray-500">Configured loan products for the organisation.</p>
            <table class="min-w-full mt-6">
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
    </main>
  </div>
  <div v-if="route.params.type === 'client-settings'" class="flex flex-1 flex-col">
    <main class="flex-1">
      <div class="pt-2 pb-16">
        <div class="mx-auto space-y-6 sm:px-6 lg:px-5">
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
                  <div class="col-span-2">
                    <label for="organizationName" class="block text-sm font-medium text-gray-700">Organization</label>
                    <input v-model="organisationSettingsForm.organizationName" type="text" id="organizationName" class="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-bg-eg focus:outline-none focus:ring-bg-eg sm:text-sm" />
                    <div class="input-errors" v-for="(error, index) of x$.organizationName.$errors" :key="index">
                      <div class="text-xs text-red-400">{{ error.$message }}</div>
                    </div>
                  </div>

                  <div class="col-span-2">
                    <label for="ussdShortCode" class="block text-sm font-medium text-gray-700">USSD Shortcode</label>
                    <input v-model="organisationSettingsForm.ussdShortCode" type="text" id="ussdShortCode" class="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-bg-eg focus:outline-none focus:ring-bg-eg sm:text-sm" />
                    <div class="input-errors" v-for="(error, index) of x$.ussdShortCode.$errors" :key="index">
                      <div class="text-xs text-red-400">{{ error.$message }}</div>
                    </div>
                  </div>

                  <div class="col-span-2">
                    <label for="organizationAlias" class="block text-sm font-medium text-gray-700">Organization Alias</label>
                    <input v-model="organisationSettingsForm.organizationAlias" type="text" id="organizationAlias" class="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-bg-eg focus:outline-none focus:ring-bg-eg sm:text-sm" />
                    <div class="input-errors" v-for="(error, index) of x$.organizationAlias.$errors" :key="index">
                      <div class="text-xs text-red-400">{{ error.$message }}</div>
                    </div>
                  </div>

                  <div class="col-span-2">
                    <label for="organizationEmail" class="block text-sm font-medium text-gray-700">Organization Email</label>
                    <input v-model="organisationSettingsForm.organizationEmail" type="email" id="organizationEmail" class="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-bg-eg focus:outline-none focus:ring-bg-eg sm:text-sm" />
                    <div class="input-errors" v-for="(error, index) of x$.organizationEmail.$errors" :key="index">
                      <div class="text-xs text-red-400">{{ error.$message }}</div>
                    </div>
                  </div>

                  <div class="col-span-2">
                    <label for="supportEmail" class="block text-sm font-medium text-gray-700">Support Email</label>
                    <input v-model="organisationSettingsForm.supportEmail" type="email" id="supportEmail" class="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-bg-eg focus:outline-none focus:ring-bg-eg sm:text-sm" />
                    <div class="input-errors" v-for="(error, index) of x$.supportEmail.$errors" :key="index">
                      <div class="text-xs text-red-400">{{ error.$message }}</div>
                    </div>
                  </div>

                  <div class="col-span-1">
                    <label for="organizationPrimaryTheme" class="block text-sm font-medium text-gray-700">Primary Theme</label>
                    <input v-model="organisationSettingsForm.organizationPrimaryTheme" type="color" id="organizationPrimaryTheme" class="h-9 mt-1 block w-full rounded-md border border-gray-300 py-1 px-2 shadow-sm focus:border-bg-eg focus:outline-none focus:ring-bg-eg sm:text-sm" />
                    <div class="input-errors" v-for="(error, index) of x$.organizationPrimaryTheme.$errors" :key="index">
                      <div class="text-xs text-red-400">{{ error.$message }}</div>
                    </div>
                  </div>

                  <div class="col-span-1">
                    <label for="organizationSecondaryTheme" class="block text-sm font-medium text-gray-700">Secondary Theme</label>
                    <input v-model="organisationSettingsForm.organizationSecondaryTheme" type="color" id="organizationSecondaryTheme" class="h-9 mt-1 block w-full rounded-md border border-gray-300 py-1 px-2 shadow-sm focus:border-bg-eg focus:outline-none focus:ring-bg-eg sm:text-sm" />
                    <div class="input-errors" v-for="(error, index) of x$.organizationSecondaryTheme.$errors" :key="index">
                      <div class="text-xs text-red-400">{{ error.$message }}</div>
                    </div>
                  </div>

                  <div class="col-span-2">
                    <label for="organizationLogoName" class="block text-sm font-medium text-gray-700">Logo Name</label>
                    <input v-model="organisationSettingsForm.organizationLogoName" type="text" id="organizationLogoName" class="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-bg-eg focus:outline-none focus:ring-bg-eg sm:text-sm" />
                    <div class="input-errors" v-for="(error, index) of x$.organizationLogoName.$errors" :key="index">
                      <div class="text-xs text-red-400">{{ error.$message }}</div>
                    </div>
                  </div>

                  <div class="col-span-2">
                    <label for="organizationLogoExtension" class="block text-sm font-medium text-gray-700">Logo Extension</label>
                    <input v-model="organisationSettingsForm.organizationLogoExtension" type="text" id="organizationLogoExtension" class="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-bg-eg focus:outline-none focus:ring-bg-eg sm:text-sm" />
                    <div class="input-errors" v-for="(error, index) of x$.organizationLogoExtension.$errors" :key="index">
                      <div class="text-xs text-red-400">{{ error.$message }}</div>
                    </div>
                  </div>

                  <div class="col-span-2">
                    <label for="loanProductMaxPeriod" class="block text-sm font-medium text-gray-700">Loan Product MaxPeriod(Months)</label>
                    <input v-model="organisationSettingsForm.loanProductMaxPeriod" type="number" id="loanProductMaxPeriod" class="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-bg-eg focus:outline-none focus:ring-bg-eg sm:text-sm" />
                    <div class="input-errors" v-for="(error, index) of x$.loanProductMaxPeriod.$errors" :key="index">
                      <div class="text-xs text-red-400">{{ error.$message }}</div>
                    </div>
                  </div>

                  <div class="col-span-2">
                    <label for="coreBankingIntegration" class="block text-sm font-medium text-gray-700">CoreBanking Integration</label>
                    <select v-model="organisationSettingsForm.coreBankingIntegration" id="coreBankingIntegration" class="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-bg-eg focus:outline-none focus:ring-bg-eg sm:text-sm">
                      <option value="JUMBOSTAR">JUMBOSTAR</option>
                      <option value="DEFAULT">DEFAULT</option>
                      <option value="CENTRINO">CENTRINO</option>
                    </select>
                    <div class="input-errors" v-for="(error, index) of x$.coreBankingIntegration.$errors" :key="index">
                      <div class="text-xs text-red-400">{{ error.$message }}</div>
                    </div>
                  </div>

                  <div class="col-span-2">
                    <label for="notificationProvider" class="block text-sm font-medium text-gray-700">Notification Provider</label>
                    <select v-model="organisationSettingsForm.notificationProvider" id="notificationProvider" class="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-bg-eg focus:outline-none focus:ring-bg-eg sm:text-sm">
                      <option value="JUMBOSTAR">JUMBOSTAR</option>
                      <option value="DEFAULT">DEFAULT</option>
                      <option value="CENTRINO">CENTRINO</option>
                    </select>
                    <div class="input-errors" v-for="(error, index) of x$.notificationProvider.$errors" :key="index">
                      <div class="text-xs text-red-400">{{ error.$message }}</div>
                    </div>
                  </div>

                  <div class="col-span-2">
                    <label for="identifierType" class="block text-sm font-medium text-gray-700">Identifier Type</label>
                    <select v-model="organisationSettingsForm.identifierType" id="identifierType" class="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-bg-eg focus:outline-none focus:ring-bg-eg sm:text-sm">
                      <option value="EMAIL">EMAIL</option>
                      <option value="ID_NUMBER">ID NUMBER</option>
                      <option value="PHONE_NUMBER">PHONE NUMBER</option>
                      <option value="MEMBER_NUMBER">MEMBER NUMBER</option>
                    </select>
                    <div class="input-errors" v-for="(error, index) of x$.identifierType.$errors" :key="index">
                      <div class="text-xs text-red-400">{{ error.$message }}</div>
                    </div>
                  </div>

                  <div class="col-span-1">
                    <div class="flex flex-row-reverse">
                      <label for="parallelLoans" class="block w-24 text-sm font-medium text-gray-700 flex-grow ml-2">Parallel Loans</label>
                      <input v-model="organisationSettingsForm.parallelLoans" type="checkbox" id="parallelLoans" class="h-4 w-4 rounded border-gray-300 text-bg-eg focus:border-bg-eg focus:outline-none focus:ring-bg-eg" />
                    </div>
                    <div class="input-errors" v-for="(error, index) of x$.parallelLoans.$errors" :key="index">
                      <div class="text-xs text-red-400">{{ error.$message }}</div>
                    </div>
                  </div>

                  <div class="col-span-1">
                    <div class="flex flex-row-reverse">
                      <label for="requireWitness" class="block w-24 text-sm font-medium text-gray-700 flex-grow ml-2">Require Witness</label>
                      <input v-model="organisationSettingsForm.requireWitness" type="checkbox" id="requireWitness" class="h-4 w-4 rounded border-gray-300 text-bg-eg focus:border-bg-eg focus:outline-none focus:ring-bg-eg" />
                    </div>
                    <div class="input-errors" v-for="(error, index) of x$.requireWitness.$errors" :key="index">
                      <div class="text-xs text-red-400">{{ error.$message }}</div>
                    </div>
                  </div>

                  <div class="col-span-1">
                    <div class="flex flex-row-reverse">
                      <label for="allowZeroGuarantors" class="block w-24 text-sm font-medium text-gray-700 flex-grow ml-2">Allow Zero Guarantors</label>
                      <input v-model="organisationSettingsForm.allowZeroGuarantors" type="checkbox" id="allowZeroGuarantors" class="h-4 w-4 rounded border-gray-300 text-bg-eg focus:border-bg-eg focus:outline-none focus:ring-bg-eg" />
                    </div>
                    <div class="input-errors" v-for="(error, index) of x$.allowZeroGuarantors.$errors" :key="index">
                      <div class="text-xs text-red-400">{{ error.$message }}</div>
                    </div>
                  </div>

                  <div class="col-span-1">
                    <div class="flex flex-row-reverse">
                      <label for="allowSelfGuarantee" class="block w-24 text-sm font-medium text-gray-700 flex-grow ml-2">Allow Self Guarantee</label>
                      <input v-model="organisationSettingsForm.allowSelfGuarantee" type="checkbox" id="allowSelfGuarantee" class="h-4 w-4 rounded border-gray-300 text-bg-eg focus:border-bg-eg focus:outline-none focus:ring-bg-eg" />
                    </div>
                    <div class="input-errors" v-for="(error, index) of x$.allowSelfGuarantee.$errors" :key="index">
                    <div class="text-xs text-red-400">{{ error.$message }}</div>
                    </div>
                  </div>

                  <div class="col-span-1">
                    <div class="flex flex-row-reverse">
                      <label for="isGuaranteedAmountShared" class="block w-24 text-sm font-medium text-gray-700 flex-grow ml-2">Share Guaranteed Amount</label>
                      <input v-model="organisationSettingsForm.isGuaranteedAmountShared" type="checkbox" id="isGuaranteedAmountShared" class="h-4 w-4 rounded border-gray-300 text-bg-eg focus:border-bg-eg focus:outline-none focus:ring-bg-eg" />
                    </div>
                    <div class="input-errors" v-for="(error, index) of x$.isGuaranteedAmountShared.$errors" :key="index">
                      <div class="text-xs text-red-400">{{ error.$message }}</div>
                    </div>
                  </div>

                  <div class="col-span-1">
                    <div class="flex flex-row-reverse">
                      <label for="useEmbeddedURL" class="block w-24 text-sm font-medium text-gray-700 flex-grow ml-2">Use Embedded URL</label>
                      <input v-model="organisationSettingsForm.useEmbeddedURL" type="checkbox" id="useEmbeddedURL" class="h-4 w-4 rounded border-gray-300 text-bg-eg focus:border-bg-eg focus:outline-none focus:ring-bg-eg" />
                    </div>
                    <div class="input-errors" v-for="(error, index) of x$.useEmbeddedURL.$errors" :key="index">
                      <div class="text-xs text-red-400">{{ error.$message }}</div>
                    </div>
                  </div>

                  <div class="col-span-1">
                    <div class="flex flex-row-reverse">
                      <label for="containsAttachments" class="block w-24 text-sm font-medium text-gray-700 flex-grow ml-2">Contains Attachments</label>
                      <input v-model="organisationSettingsForm.containsAttachments" type="checkbox" id="containsAttachments" class="h-4 w-4 rounded border-gray-300 text-bg-eg focus:border-bg-eg focus:outline-none focus:ring-bg-eg" />
                    </div>
                    <div class="input-errors" v-for="(error, index) of x$.containsAttachments.$errors" :key="index">
                    <div class="text-xs text-red-400">{{ error.$message }}</div>
                    </div>
                  </div>

                  <div class="col-span-1">
                    <div class="flex flex-row-reverse">
                      <label for="customSMS" class="block w-24 text-sm font-medium text-gray-700 flex-grow ml-2">Custom SMS</label>
                      <input v-model="organisationSettingsForm.customSMS" type="checkbox" id="customSMS" class="h-4 w-4 rounded border-gray-300 text-bg-eg focus:border-bg-eg focus:outline-none focus:ring-bg-eg" />
                    </div>
                    <div class="input-errors" v-for="(error, index) of x$.customSMS.$errors" :key="index">
                      <div class="text-xs text-red-400">{{ error.$message }}</div>
                    </div>
                  </div>

                  <div class="col-span-2">
                    <button @click="otherDetails = !otherDetails" type="button" class="inline-flex mx-1.5 items-center rounded-md border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-eg-lightblue focus:ring-offset-2 sm:text-sm">
                      Custom Form Fields
                      <ChevronDownIcon class="h-4 w-4 ml-2 text-gray-600"/>
                    </button>
                  </div>

                  <div class="col-span-6">
                    <Transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
                      <div v-if="otherDetails" class="flex flex-1 items-stretch">
                        <main class="flex-1 overflow-y-auto">
                          <section aria-labelledby="primary-heading" class="flex h-full min-w-0 flex-1 flex-col lg:order-last">
                            <div class="flex">
                              <h6 class="py-2 sm:py-3 sm:px-6 font-medium text-base">KYC details as configured on zoho forms.</h6>
                              <div class="flex items-center justify-center bg-white">
                                <button type="button" v-if="!otherDetailsEdit" @click="otherDetailsEdit = !otherDetailsEdit" class="inline-flex cursor-pointer items-center rounded-full bg-black py-0.5 px-2 text-xs font-medium text-white">
                                  Add
                                </button>
                              </div>
                            </div>
                            <dl class="sm:divide-y sm:divide-gray-200">
                              <TransitionGroup enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
                                <div v-for="(key, i) in organisationDetails" :key="key+i" class="py-2 sm:grid sm:grid-cols-5 sm:gap-4 sm:py-3 sm:px-6">
                                  <dt class="text-sm font-medium text-gray-500 col-span-2">
                                    <div class="border-b border-gray-300 focus-within:border-eg-bgopacity">
                                      <input disabled :value="key" type="text" class="block w-full border-0 border-b border-transparent bg-gray-200 cursor-not-allowed focus:ring-eg-lightblue focus:border-eg-bgopacity focus:ring-0 sm:text-sm" placeholder="key" />
                                    </div>
                                  </dt>
                                  <dd class="mt-1 text-sm text-gray-900 sm:mt-0 col-span-2">
                                    <div class="border-b border-gray-300 focus-within:border-eg-bgopacity mt-1 sm:mt-0">
                                      <select :disabled="!otherDetailsEdit" required v-model="organisationSettingsForm.details[key].value" class="block w-full border-0 border-b border-transparent bg-gray-50 focus:ring-eg-lightblue focus:border-eg-bgopacity focus:ring-0 sm:text-sm">
                                        <option :value="''">-Select Input Type-</option>
                                        <option value="BOOLEAN">TRUE/FALSE</option>
                                        <option value="STRING">ALPHANUMERIC</option>
                                        <option value="NUMBER">NUMERIC</option>
                                      </select>
                                    </div>
                                  </dd>
                                  <dd v-if="otherDetailsEdit" class="mt-1 flex justify-center items-center text-sm text-gray-900 sm:mt-0 col-span-1">
                                    <button type="button" @click="delete organisationSettingsForm.details[key]">
                                      <TrashIcon class="w-5 h-5 text-red-400" />
                                    </button>
                                  </dd>
                                </div>
                              </TransitionGroup>
                            </dl>
                            <div v-if="otherDetailsEdit" class="sm:divide-y sm:divide-gray-200 py-2 sm:py-3 sm:px-6">
                              <div v-if="addingKey" class="flex rounded-md drop-shadow-2xl max-w-xs">
                                <input v-model="keyString" type="text" class="block w-full min-w-0 flex-1 rounded-l-md border-r-0 border-gray-300 px-3 py-2 outline-0 focus:border-gray-300 focus:outline-none focus:ring-0 sm:text-sm" placeholder="detail key" />
                                <button :disabled="keyString === ''" @click="organisationSettingsForm.details[`${keyString}`] = { value: '', type: 'TEXT' };addingKey = !addingKey" type="button" class="inline-flex items-center rounded-r-md border border-l-0 border-gray-300 bg-green-50 px-3 text-gray-500 sm:text-sm hover:bg-green-100 focus:bg-green-200">
                                  <CheckCircleIcon class="w-6 h-6" />
                                </button>
                              </div>
                              <button v-else type="button" @click="addingKey = !addingKey">
                                <PlusCircleIcon class="w-6 h-6" />
                              </button>
                            </div>
                          </section>
                        </main>
                      </div>
                    </Transition>
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
    </main>
  </div>
</template>
