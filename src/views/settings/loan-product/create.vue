<script setup lang="ts">
import {ChevronDownIcon, TrashIcon, PlusCircleIcon, CheckCircleIcon} from "@heroicons/vue/24/outline"
import Breadcrumb from "../../../components/Breadcrumb.vue";
import {computed, onMounted, reactive, ref, watch} from "vue";
import {useRouter} from "vue-router";
import stores from "../../../stores";
import {required} from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import {LoanProductFormType} from "../../../stores/loan-product-store";
const {authStore, zohoStore, loanProductStore} = stores
const router = useRouter()

onMounted(async () => {
  await Promise.allSettled([
    zohoStore.fetchLoanProductTemplates()
  ])
})

const loanProductForm = reactive<Omit<LoanProductFormType, "refId">>({
  name: '',
  interestRate: '',
  requiredGuarantors: '',
  maxPeriod: '',
  coreBankingLoanTypeCode: '',
  templateName: '',
  templateId: '',
  roleActions: [],
  details: {}
})

const keyString = ref('')

const addingKey = ref(false)

const otherDetails = ref<boolean>(false)

const otherDetailsEdit = ref<boolean>(false)

const loanProductFormRules = {
  name: {
    required,
  },
  interestRate: {
    required,
  },
  requiredGuarantors: {
    required,
  },
  maxPeriod: {
    required,
  },
  coreBankingLoanTypeCode: {

  },
  templateName: {
    required,
  },
  templateId: {
    required,
  },
  roleActions: {
    required
  }
}

const v$ = useVuelidate(loanProductFormRules, loanProductForm, { $lazy: true, $autoDirty: true})

const submitLoanProduct = async () => {
  const result = await v$.value.$validate()

  if (result) {
    const payload = {
      name: loanProductForm.name,
      interestRate: `${loanProductForm.interestRate}`,
      requiredGuarantors: `${loanProductForm.requiredGuarantors}`,
      maxPeriod: loanProductForm.maxPeriod,
      coreBankingLoanTypeCode: loanProductForm.coreBankingLoanTypeCode,
      templateName: loanProductForm.templateName,
      templateId: loanProductForm.templateId,
      roleActions: loanProductForm.roleActions,
      details: loanProductForm.details,
    }
    loanProductStore.postLoanProduct(payload).then(() => router.push('/settings/loan-products')).then(() => authStore.defineNotification({
      id: (Math.random().toString(36) + Date.now().toString(36)).substring(2),
      message: `Loan Product Created`,
      success: true
    }))
  }
}

watch(() => loanProductForm.templateId, async (templateId) => {
  const selectedTemplate = zohoStore.getZohoTemplates.find(template => template.template_id === templateId)
  if (selectedTemplate) {
    loanProductForm.templateName = selectedTemplate.template_name
    await Promise.allSettled([
      zohoStore.fetchTemplateDetails(templateId)
    ])
  }
})
watch(() => zohoStore.getZohoTemplateDetails, (details) => {
  loanProductForm.roleActions = details
})

const loanProductDetails = computed(() => {
  return Object.keys(loanProductForm.details)
})
</script>
<template>
  <div class="flex flex-1 flex-col">
    <main class="flex-1">
      <div class="pt-2 pb-6">
        <div class="mx-auto space-y-6 sm:px-6 lg:px-5">
          <div class="flex justify-between items-center">
            <Breadcrumb pageName="" linkName="Loan Products" linkUrl="/settings/loan-products"  current="Create Loan Product"/>
          </div>
          <form @submit.prevent="submitLoanProduct">
            <div class="shadow sm:overflow-hidden sm:rounded-md">
              <div class="space-y-6 bg-white py-6 px-4 sm:p-6">
                <div>
                  <h3 class="text-lg font-medium leading-6 text-slate-900">Create Loan Product</h3>
                  <p class="mt-1 text-sm text-slate-500">Configure new loan products for you organisation.</p>
                </div>

                <div class="flex flex-1 items-stretch overflow-hidden">
                  <main class="flex-1 overflow-y-auto">
                    <section aria-labelledby="primary-heading" class="flex h-full min-w-0 flex-1 flex-col lg:order-last">
                      <h1 id="primary-heading" class="sr-only">loan product</h1>
                      <dl>
                        <div class="grid grid-cols-6 gap-6">
                          <div class="col-span-6">
                            <label for="name" class="block text-sm font-medium text-slate-700">Product Name</label>
                            <input v-model="loanProductForm.name" id="name" type="text" class="mt-1 block w-full rounded-md border border-slate-300 py-2 px-3 shadow-sm focus:border-bg-eg focus:outline-none focus:ring-bg-eg sm:text-sm" />
                            <div class="input-errors" v-for="(error, index) of v$.name.$errors" :key="index">
                              <div class="text-xs text-red-400">{{ error.$message }}</div>
                            </div>
                          </div>
                          <div class="col-span-6">
                            <label for="guarantors" class="block text-sm font-medium text-slate-700">No. of Guarantors	</label>
                            <input v-model="loanProductForm.requiredGuarantors" id="guarantors" type="number" class="mt-1 block w-full rounded-md border border-slate-300 py-2 px-3 shadow-sm focus:border-bg-eg focus:outline-none focus:ring-bg-eg sm:text-sm" />
                            <div class="input-errors" v-for="(error, index) of v$.requiredGuarantors.$errors" :key="index">
                              <div class="text-xs text-red-400">{{ error.$message }}</div>
                            </div>
                          </div>
                          <div class="col-span-6">
                            <label for="rate" class="block text-sm font-medium text-slate-700">Interest Rate (%)</label>
                            <input v-model="loanProductForm.interestRate" id="rate" type="number" class="mt-1 block w-full rounded-md border border-slate-300 py-2 px-3 shadow-sm focus:border-bg-eg focus:outline-none focus:ring-bg-eg sm:text-sm" />
                            <div class="input-errors" v-for="(error, index) of v$.interestRate.$errors" :key="index">
                              <div class="text-xs text-red-400">{{ error.$message }}</div>
                            </div>
                          </div>
                          <div class="col-span-6">
                            <label for="rate" class="block text-sm font-medium text-slate-700">Maximum Period (Months)</label>
                            <input v-model="loanProductForm.maxPeriod" id="rate" type="number" class="mt-1 block w-full rounded-md border border-slate-300 py-2 px-3 shadow-sm focus:border-bg-eg focus:outline-none focus:ring-bg-eg sm:text-sm" />
                            <div class="input-errors" v-for="(error, index) of v$.maxPeriod.$errors" :key="index">
                              <div class="text-xs text-red-400">{{ error.$message }}</div>
                            </div>
                          </div>
                          <div class="col-span-6">
                            <label for="rate" class="block text-sm font-medium text-slate-700">CoreBanking Loan Type Code</label>
                            <input v-model="loanProductForm.coreBankingLoanTypeCode" id="rate" type="number" class="mt-1 block w-full rounded-md border border-slate-300 py-2 px-3 shadow-sm focus:border-bg-eg focus:outline-none focus:ring-bg-eg sm:text-sm" />
                            <div class="input-errors" v-for="(error, index) of v$.coreBankingLoanTypeCode.$errors" :key="index">
                              <div class="text-xs text-red-400">{{ error.$message }}</div>
                            </div>
                          </div>
                          <div class="col-span-6">
                            <label for="template-name" class="block text-sm font-medium text-slate-700">Template Name</label>
                            <select v-model="loanProductForm.templateId" id="template-name" class="mt-1 block w-full rounded-md border border-slate-300 py-2 px-3 shadow-sm focus:border-bg-eg focus:outline-none focus:ring-bg-eg sm:text-sm">
                              <option :value="''">-Select Template-</option>
                              <option v-for="(template, i) in zohoStore.getZohoTemplates" :key="`${template.template_id}${i}`" :value="template.template_id">{{ template.template_name }}</option>
                            </select>
                            <div class="input-errors" v-for="(error, index) of v$.templateId.$errors" :key="index">
                              <div class="text-xs text-red-400">{{ error.$message }}</div>
                            </div>
                          </div>
                          <div class="col-span-6">
                            <label for="template-id" class="block text-sm font-medium text-slate-700">Template ID</label>
                            <input disabled v-model="loanProductForm.templateId" id="template-id" type="number" class="mt-1 block w-full rounded-md border border-slate-300 py-2 px-3 shadow-sm focus:border-bg-eg focus:outline-none focus:ring-bg-eg sm:text-sm" />
                            <div class="input-errors" v-for="(error, index) of v$.templateId.$errors" :key="index">
                              <div class="text-xs text-red-400">{{ error.$message }}</div>
                            </div>
                          </div>
                          <div class="col-span-6 flex justify-between">
                            <dt class="text-sm font-medium text-slate-500"></dt>
                            <dd class="mt-1 text-sm text-slate-900 sm:col-span-2 sm:mt-0">
                              <button @click="otherDetails = !otherDetails" type="button" class="inline-flex mx-1.5 items-center rounded-md border border-slate-300 bg-white px-4 py-2 font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-eg-lightblue focus:ring-offset-2 sm:text-sm">
                                Other Details
                                <ChevronDownIcon class="h-4 w-4 ml-2 text-slate-600"/>
                              </button>
                            </dd>
                          </div>
                          <div class="col-span-6">
                            <Transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
                              <div v-if="otherDetails" class="flex flex-1 items-stretch overflow-hidden">
                                <main class="flex-1 overflow-y-auto">
                                  <section aria-labelledby="primary-heading" class="flex h-full min-w-0 flex-1 flex-col lg:order-last">
                                    <div class="flex">
                                      <h6 class="py-2 sm:py-3 sm:px-6 font-medium text-base">Other details</h6>
                                      <div class="flex items-center justify-center bg-white">
                                        <button type="button" v-if="!otherDetailsEdit" @click="otherDetailsEdit = !otherDetailsEdit" class="inline-flex cursor-pointer items-center rounded-full bg-black py-0.5 px-2 text-xs font-medium text-white">
                                          Add
                                        </button>
                                      </div>
                                    </div>
                                    <dl class="sm:divide-y sm:divide-slate-200">
                                      <TransitionGroup enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
                                        <div v-for="(key, i) in loanProductDetails" :key="key+i" class="py-2 sm:grid sm:grid-cols-5 sm:gap-4 sm:py-3 sm:px-6">
                                          <dt class="text-sm font-medium text-slate-500 col-span-2">
                                            <div class="border-b border-slate-300 focus-within:border-eg-bgopacity">
                                              <input disabled :value="key" type="text" class="block w-full border-0 border-b border-transparent bg-slate-200 cursor-not-allowed focus:ring-eg-lightblue focus:border-eg-bgopacity focus:ring-0 sm:text-sm" placeholder="key" />
                                            </div>
                                          </dt>
                                          <dd class="mt-1 text-sm text-slate-900 sm:mt-0 col-span-2">
                                            <div class="border-b border-slate-300 focus-within:border-eg-bgopacity mt-1 sm:mt-0">
                                              <input :disabled="!otherDetailsEdit" required v-model="loanProductForm.details[key].value" type="text" class="block w-full border-0 border-b border-transparent bg-slate-50 focus:ring-eg-lightblue focus:border-eg-bgopacity focus:ring-0 sm:text-sm" placeholder="value" />
                                            </div>
                                          </dd>
                                          <dd v-if="otherDetailsEdit" class="mt-1 flex justify-center items-center text-sm text-slate-900 sm:mt-0 col-span-1">
                                            <button type="button" @click="delete loanProductForm.details[key]">
                                              <TrashIcon class="w-5 h-5 text-red-400" />
                                            </button>
                                          </dd>
                                        </div>
                                      </TransitionGroup>
                                    </dl>
                                    <div v-if="otherDetailsEdit" class="sm:divide-y sm:divide-slate-200 py-2 sm:py-3 sm:px-6">
                                      <div v-if="addingKey" class="flex rounded-md shadow-sm max-w-xs">
                                        <button :disabled="keyString === ''" @click="loanProductForm.details[`${keyString}`] = { value: '', type: 'TEXT' };addingKey = !addingKey" type="button" class="inline-flex items-center rounded-l-md border border-r-0 border-slate-300 bg-green-50 px-3 text-slate-500 sm:text-sm hover:bg-green-100 focus:bg-green-200">
                                          <CheckCircleIcon class="w-6 h-6" />
                                        </button>
                                        <input v-model="keyString" type="text" class="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-slate-300 px-3 py-2 focus:border-eg-bg focus:ring-eg-bg sm:text-sm" placeholder="detail key" />
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
                      </dl>
                    </section>
                  </main>
                  <aside class="flex-1 overflow-y-auto bg-white block">
                    <dl class="sm:divide-y sm:divide-slate-200 p-4">
                      <div v-for="zohoDetail in zohoStore.getZohoTemplateDetails" :key="zohoDetail.action_id" class="py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-3 sm:px-6">
                        <dt class="text-sm font-medium text-slate-500">{{ zohoDetail.role }}</dt>
                        <dd class="mt-1 text-sm text-slate-900 sm:col-span-2 sm:mt-0">{{ zohoDetail.action_id }}</dd>
                      </div>
                    </dl>
                  </aside>
                </div>
              </div>
              <div class="bg-slate-50 px-4 py-3 text-left sm:px-6 space-x-4">
                <button @click="router.push('/settings/loan-products')" :disabled="authStore.getLoadingState" type="button" class="inline-flex justify-center rounded-md border border-transparent bg-red-300 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2">Cancel</button>
                <button :disabled="authStore.getLoadingState" type="submit" class="inline-flex justify-center rounded-md border border-transparent bg-eg-bg py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-eg-lightblue focus:outline-none focus:ring-2 focus:ring-eg-lightblue focus:ring-offset-2">Save</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </main>
  </div>
</template>