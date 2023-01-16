<script setup lang="ts">
import Breadcrumb from "../../../components/Breadcrumb.vue";
import {onMounted, reactive, watch} from "vue";
import {useRoute, useRouter} from "vue-router";
import stores from "../../../stores";
import {required} from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
const {authStore, zohoStore, loanProductStore} = stores
const router = useRouter()
const route = useRoute()

onMounted(async () => {
  await Promise.allSettled([
      loanProductStore.fetchLoanProduct(route.params.refId as string),
    zohoStore.fetchLoanProductTemplates()
  ])
})

const loanProductForm = reactive<{name: string, interestRate: string, requiredGuarantors: string, templateName: string, templateId: string, refId: string, roleActions: { role: string; action_id: string; action_type: string; recipient_name: string; recipient_phonenumber: string; is_embedded: boolean; recipient_email: string; private_notes: string; verify_recipient: boolean; }[]}>({
  name: '',
  interestRate: '',
  requiredGuarantors: '',
  templateName: '',
  templateId: '',
  refId: '',
  roleActions: []
})

const loanProductFormRules = {
  name: {
    required,
  },
  refId: {
    required,
  },
  interestRate: {
    required,
  },
  requiredGuarantors: {
    required,
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
watch(() => loanProductStore.getLoanProduct, (loanProduct) => {
  if (loanProduct) {
    loanProductForm.refId = loanProduct.refId
    loanProductForm.name = loanProduct.name
    loanProductForm.interestRate = `${loanProduct.interestRate}`
    loanProductForm.requiredGuarantors = `${loanProduct.requiredGuarantors}`
    loanProductForm.templateName = loanProduct.templateName
    loanProductForm.templateId = loanProduct.templateId
    loanProductForm.roleActions = loanProduct.roleActions
  }
})

const updateLoanProduct = async () => {
  const result = await v$.value.$validate()

  if (result) {
    console.log(loanProductForm)
    const payload = {
      refId: loanProductForm.refId,
      name: loanProductForm.name,
      interestRate: `${loanProductForm.interestRate}`,
      requiredGuarantors: `${loanProductForm.requiredGuarantors}`,
      templateName: loanProductForm.templateName,
      templateId: loanProductForm.templateId,
      roleActions: loanProductForm.roleActions
    }
    loanProductStore.postLoanProduct(payload).then(() => router.push('/settings/loan-products')).then(() => authStore.defineNotification({
      id: (Math.random().toString(36) + Date.now().toString(36)).substring(2),
      message: `Loan Product Updated`,
      success: true
    }))
  }
}
</script>
<template>
  <div class="flex flex-1 flex-col md:pl-24">
    <main class="flex-1">
      <div class="py-16">
        <div class="mx-auto space-y-6 sm:px-6 lg:px-5">
          <div class="flex justify-between items-center">
            <Breadcrumb pageName="" linkName="Loan Products" linkUrl="/settings/loan-products"  current="Edit Loan Product"/>
          </div>
          <form @submit.prevent="updateLoanProduct">
            <div class="shadow sm:overflow-hidden sm:rounded-md">
              <div class="space-y-6 bg-white py-6 px-4 sm:p-6">
                <div>
                  <h3 class="text-lg font-medium leading-6 text-gray-900">Edit Loan Product</h3>
                  <p class="mt-1 text-sm text-gray-500">Edit loan products.</p>
                </div>

                <div class="flex flex-1 items-stretch overflow-hidden">
                  <main class="flex-1 overflow-y-auto">
                    <section aria-labelledby="primary-heading" class="flex h-full min-w-0 flex-1 flex-col lg:order-last">
                      <h1 id="primary-heading" class="sr-only">loan product</h1>
                      <dl>
                        <div class="grid grid-cols-6 gap-6">
                          <div class="col-span-6">
                            <label for="name" class="block text-sm font-medium text-gray-700">Product Name</label>
                            <input v-model="loanProductForm.name" id="name" type="text" class="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-bg-eg focus:outline-none focus:ring-bg-eg sm:text-sm" />
                            <div class="input-errors" v-for="(error, index) of v$.name.$errors" :key="index">
                              <div class="text-xs text-red-400">{{ error.$message }}</div>
                            </div>
                          </div>
                          <div class="col-span-6">
                            <label for="guarantors" class="block text-sm font-medium text-gray-700">No. of Guarantors	</label>
                            <input v-model="loanProductForm.requiredGuarantors" id="guarantors" type="number" class="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-bg-eg focus:outline-none focus:ring-bg-eg sm:text-sm" />
                            <div class="input-errors" v-for="(error, index) of v$.requiredGuarantors.$errors" :key="index">
                              <div class="text-xs text-red-400">{{ error.$message }}</div>
                            </div>
                          </div>
                          <div class="col-span-6">
                            <label for="rate" class="block text-sm font-medium text-gray-700">Interest Rate (%)</label>
                            <input v-model="loanProductForm.interestRate" id="rate" type="number" class="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-bg-eg focus:outline-none focus:ring-bg-eg sm:text-sm" />
                            <div class="input-errors" v-for="(error, index) of v$.interestRate.$errors" :key="index">
                              <div class="text-xs text-red-400">{{ error.$message }}</div>
                            </div>
                          </div>
                          <div class="col-span-6">
                            <label for="template-name" class="block text-sm font-medium text-gray-700">Template Name</label>
                            <select v-model="loanProductForm.templateId" id="template-name" class="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-bg-eg focus:outline-none focus:ring-bg-eg sm:text-sm">
                              <option :value="''">-Select Template-</option>
                              <option v-for="(template, i) in zohoStore.getZohoTemplates" :key="`${template.template_id}${i}`" :value="template.template_id">{{ template.template_name }}</option>
                            </select>
                            <div class="input-errors" v-for="(error, index) of v$.templateId.$errors" :key="index">
                              <div class="text-xs text-red-400">{{ error.$message }}</div>
                            </div>
                          </div>
                          <div class="col-span-6">
                            <label for="template-id" class="block text-sm font-medium text-gray-700">Template ID</label>
                            <input disabled v-model="loanProductForm.templateId" id="template-id" type="number" class="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-bg-eg focus:outline-none focus:ring-bg-eg sm:text-sm" />
                            <div class="input-errors" v-for="(error, index) of v$.templateId.$errors" :key="index">
                              <div class="text-xs text-red-400">{{ error.$message }}</div>
                            </div>
                          </div>
                        </div>
                      </dl>
                    </section>
                  </main>
                  <aside class="flex-1 overflow-y-auto bg-white block">
                    <dl class="sm:divide-y sm:divide-gray-200 p-4">
                      <div v-for="zohoDetail in zohoStore.getZohoTemplateDetails" :key="zohoDetail.action_id" class="py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-3 sm:px-6">
                        <dt class="text-sm font-medium text-gray-500">{{ zohoDetail.role }}</dt>
                        <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{{ zohoDetail.action_id }}</dd>
                      </div>
                    </dl>
                  </aside>
                </div>
              </div>
              <div class="bg-gray-50 px-4 py-3 text-left sm:px-6 space-x-4">
                <button @click="router.push('/settings/loan-products')" :disabled="authStore.getLoadingState" type="button" class="inline-flex justify-center rounded-md border border-transparent bg-red-300 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2">Cancel</button>
                <button :disabled="authStore.getLoadingState" type="submit" class="inline-flex justify-center rounded-md border border-transparent bg-eg-bg py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-eg-lightblue focus:outline-none focus:ring-2 focus:ring-eg-lightblue focus:ring-offset-2">Update</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </main>
  </div>
</template>