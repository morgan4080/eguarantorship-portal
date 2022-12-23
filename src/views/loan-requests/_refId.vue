<script setup lang="ts">
  import * as d3 from 'd3'
  import stores from "../../stores";
  import {useRoute, useRouter} from "vue-router";
  import {computed, ComputedRef, onMounted, reactive, ref, watch} from "vue";
  import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
  import { ExclamationCircleIcon, ChevronDownIcon, TrashIcon, PlusCircleIcon, CheckCircleIcon, XMarkIcon } from '@heroicons/vue/24/outline'
  import Breadcrumb from "../../components/Breadcrumb.vue";
  import {GuarantorData} from "../../stores/loan-request-store";
  const { loanRequestStore, authStore } = stores;
  const router = useRouter();
  const route = useRoute();

  type guarantorList = {
    refId: string,
    memberNumber: string,
    memberRefId: string,
    firstName: string,
    lastName: string,
    dateAccepted: string,
    isAccepted: boolean,
    isSigned: boolean,
    isActive: boolean,
    committedAmount: number,
    availableAmount: number,
    totalDeposits: number
  }

  onMounted(async () => {
    await Promise.all([
      loanRequestStore.fetchLoanRequest(`${route.params.refId}`)
    ])

    if (loanRequestStore.getLoanRequest && loanRequestStore.getLoanRequest.loanRequestProgress) {
      addArc();
      addArc().remove();
      addArc()
          .transition()
          .duration(750)
          .call(arcTween, (2 * Math.PI) * loanRequestStore.getLoanRequest.loanRequestProgress / 100, arc());
    }
  })

  const getSVG = () => {
    return (
        d3.select(`#test--svg--0`).select('g')
    )
  };

  const arc: any = () => {
    let {width, height, pathStyle} = {
      height: 160,
      width: 160,
      pathStyle: {
        width: 10,
        fill: '#BA6A5D'
      }
    };
    let radius = Math.min(width, height) / 2;
    return (
        d3.arc()
            .innerRadius(radius - pathStyle.width)
            .outerRadius(radius)
            .startAngle(0)
    )
  };

  const addArc = () => {
    return (
        getSVG().append("path")
            .datum({endAngle: 0})
            .style("fill", "#459aab")
            .attr("d", arc())
    )
  };

  const arcTween = (transition: { attrTween: (arg0: string, arg1: (d: any) => (t: any) => any) => void; }, newAngle: any, arc: (arg0: any) => any) => {
    transition.attrTween('d', (d) => {
      const interpolate = d3.interpolate(d.endAngle, newAngle);
      const newArc = d;
      return (t) => {
        newArc.endAngle = interpolate(t);
        return arc(newArc);
      };
    });
  };

  const documentDetails = ref<any[]>([])

  const downloadLoanRequestForm = async () => {
    window.open(`${import.meta.env.VITE_API_URL}/zoho/${loanRequestStore.getLoanRequest?.zohoRequestId}/PDF`, '_blank')
  }

  const hrWidth = (guarantor: GuarantorData) => {
    let step = 0;
    if (guarantor.isAccepted) {
      step += 1;
    }
    if (guarantor.isSigned) {
      step += 1;
    }
    if (guarantor.isApproved) {
      step += 1;
    }
    return (step * 100) / 3;
  };

  const hrWidth2 = () => {
    let step = 0;
    if (loanRequestStore.getLoanRequest && loanRequestStore.getLoanRequest.witnessAccepted) step += 1;
    if (loanRequestStore.getLoanRequest && loanRequestStore.getLoanRequest.witnessSigned) step += 1;
    return (step * 100) / 2;
  };

  const resubmitLR2Zoho = async () => {
    const [resubmitted] = await Promise.allSettled([
      loanRequestStore.resubmitForSigning(`${route.params.refId}`)
    ])

    if (resubmitted.status === 'fulfilled') {
      authStore.defineNotification({
        id: (Math.random().toString(36) + Date.now().toString(36)).substring(2),
        message: 'Loan request resubmission successful!',
        success: true
      })
    } else {
      authStore.defineNotification({
        id: (Math.random().toString(36) + Date.now().toString(36)).substring(2),
        message: 'Could not resubmit loan request for signing!',
        error: true
      })
    }
  };

  const closeLRequest = async () => {
    const [closed] = await Promise.allSettled([
      loanRequestStore.closeLoanRequest(`${loanRequestStore.getLoanRequest?.refId}`)
    ]);

    if (closed.status === 'fulfilled') {
      authStore.defineNotification({
        id: (Math.random().toString(36) + Date.now().toString(36)).substring(2),
        message: closed.value,
        success: true
      })
      await loanRequestStore.fetchLoanRequest(`${route.params.refId}`)
    } else {
      authStore.defineNotification({
        id: (Math.random().toString(36) + Date.now().toString(36)).substring(2),
        message: 'Could not close loan request!',
        error: true
      })
    }
  }

  const post2CB = async () => {
    const [submitted] = await Promise.allSettled([
      loanRequestStore.submitToCoBanking(`${loanRequestStore.getLoanRequest?.loanRequestNumber}`)
    ])

    if (submitted.status === 'fulfilled') {
      authStore.defineNotification({
        id: (Math.random().toString(36) + Date.now().toString(36)).substring(2),
        message: 'Loan request submission to co-banking successful!',
        success: true
      })
    } else {
      authStore.defineNotification({
        id: (Math.random().toString(36) + Date.now().toString(36)).substring(2),
        message: 'Could not submit loan request to co-banking!',
        error: true
      })
    }
  }

  const submitToCoBanking = async () => {
    if (loanRequestStore.getLoanRequest && loanRequestStore.getLoanRequest.loanRequestProgress !== 100) {
      if (confirm(`You are about to close an incomplete loan request ${loanRequestStore.getLoanRequest?.loanRequestNumber}, continue?`)) {
        await Promise.allSettled([
          closeLRequest(),
          post2CB()
        ]);
      }
    } else {
      if (confirm(`Are you sure you want to close loan request number: ${loanRequestStore.getLoanRequest?.loanRequestNumber}?`)) {
        await Promise.allSettled([
          closeLRequest(),
          post2CB()
        ]);
      }
    }
  };

  const downloadAttachments = () => {
    const element = document.createElement('a')
    element.setAttribute('href', `${import.meta.env.VITE_API_URL}/zoho/${loanRequestStore.getLoanRequest?.zohoRequestId}/zip`)
    element.setAttribute('download', "Loan Attachments")
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  };

  const downloadCertificate = async () => {
    const [submitted] = await Promise.allSettled([
      loanRequestStore.downloadCompletionCertificate({
        zohoRequestId: `${loanRequestStore.getLoanRequest?.zohoRequestId}`
      })
    ])

    if (submitted.status === 'fulfilled') {
      documentDetails.value.push(submitted.value)
      await downloadPdf('Completion Certificate', documentDetails.value.pop())
    } else {
      authStore.defineNotification({
        id: (Math.random().toString(36) + Date.now().toString(36)).substring(2),
        message: 'Could not download certificate!',
        error: true
      })
    }
  };

  const downloadPdf = async (name: string, data: any) => {
    if (data && data !== '') {
      const element = document.createElement('a')
      element.setAttribute('href', `data:application/pdf;base64, ${encodeURI(data)}`)
      element.setAttribute('download', name)
      element.style.display = 'none'
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
    } else {
      authStore.defineNotification({
        id: (Math.random().toString(36) + Date.now().toString(36)).substring(2),
        message: 'Could not download, no data available!',
        error: true
      })
    }
  };

  const voidLoanRequest = async () => {
    if (loanRequestStore.getLoanRequest && loanRequestStore.getLoanRequest.applicationStatus === 'COMPLETED' && confirm("YOU ARE ABOUT TO VOID AN ALREADY APPRAISED LOAN")) {
      const [voided] = await Promise.allSettled([
        loanRequestStore.voidLoanRequest(`${loanRequestStore.getLoanRequest?.loanRequestNumber}`)
      ])

      if (voided.status === 'fulfilled') {
        authStore.defineNotification({
          id: (Math.random().toString(36) + Date.now().toString(36)).substring(2),
          message: voided.value,
          success: true
        })
      } else {
        authStore.defineNotification({
          id: (Math.random().toString(36) + Date.now().toString(36)).substring(2),
          message: 'Could not void loan request!',
          error: true
        })
      }
    }
  }

  const action = ref('')

  const zohoRequestOpen = ref(false)

  watch(() => action.value, async (actions) => {
    if (actions !== '') {
      switch (actions) {
        case 'resubmitForSigning':
          await resubmitLR2Zoho();
          break;
        case 'downloadAttachments':
          downloadAttachments();
          break;
        case 'downloadPdf':
          await  downloadLoanRequestForm();
          break;
        case 'downloadCertificate':
          await downloadCertificate();
          break;
        case 'showZohoRequest':
          console.log(actions)
          // TODO: show zoho request details
          zohoRequestOpen.value = true
          break;
        case 'submitToCoBanking':
          await submitToCoBanking();
          break;
        case 'voidLoanRequest':
          await voidLoanRequest();
          break;
      }
    }
    action.value = ''
  })

  const openErrorModal = ref(false)

  const guarantorApprovalOpen = ref(false)

  const otherDetails = ref<boolean>(false)

  const otherDetailsEdit = ref<boolean>(false)

  const form = reactive({
    details: {}
  })
  const saveLRDetails = () => {
    otherDetailsEdit.value = false
  }

  const LRDetails = computed(() => {
    if (loanRequestStore.getLoanRequest && loanRequestStore.getLoanRequest.details) {
      form.details = loanRequestStore.getLoanRequest.details
    }
    return Object.keys(form.details)
  })

  const addingKey = ref(false)

  const keyString = ref('')

  const selectedGuarantor = ref<guarantorList | null>(null)
  const approveGuarantor = async (approve: boolean) => {
    if (selectedGuarantor.value && confirm(`Are you sure you want to ${approve ? 'APPROVE' : 'DECLINE'} ${selectedGuarantor.value.firstName + ' ' + selectedGuarantor.value.lastName} as a guarantor?`)) {
      const [approved] = await Promise.allSettled([
        loanRequestStore.approveGuarantor(`${selectedGuarantor.value.refId}`, approve)
      ])
      if (approved.status === 'fulfilled') {
        authStore.defineNotification({
          id: (Math.random().toString(36) + Date.now().toString(36)).substring(2),
          message: approved.value,
          success: true
        })
      } else {
        authStore.defineNotification({
          id: (Math.random().toString(36) + Date.now().toString(36)).substring(2),
          message: `Could not ${approve ? 'approve' : 'decline'} guarantor!`,
          error: true
        })
      }

      selectedGuarantor.value = null
      guarantorApprovalOpen.value = false
    }
  }
  const setGuarantorToApprove = (guarantor: guarantorList) => {
    guarantorApprovalOpen.value = true;
    selectedGuarantor.value = guarantor;
  }
  // Record<any, any>
  type zohoRequestType = {
    templates: {
      actions: {
        action_id: string,
        action_type: string,
        is_embedded: boolean,
        private_notes: string,
        recipient_email: string,
        recipient_name: string,
        recipient_phonenumber: string,
        role: string,
        verification_type: string,
        verify_recipient: boolean
      }[],
      field_data: {
        field_boolean_data: {},
        field_date_data: {},
        field_text_data: {}
      },
      notes: string,
      request_name: string
    }
  }
  const zohoRequest: ComputedRef<zohoRequestType> = computed(() => {
    if (loanRequestStore.getLoanRequest?.zohoRequest) {
      return JSON.parse(loanRequestStore.getLoanRequest?.zohoRequest)
    } else {
      return null
    }
  })

</script>
<template>
  <div class="flex flex-1 flex-col md:pl-24">
    <main class="flex-1">
      <div class="py-16">
        <div class="mx-auto max-w-7xl space-y-4 sm:px-6 lg:px-5">
          <div class="flex justify-between items-center">
            <Breadcrumb pageName="" linkName="All Loan Requests" linkUrl="/loan-requests"  :current="`Request ${loanRequestStore.getLoanRequest?.loanRequestNumber}`"/>
            <select v-model="action" class="block mr-5 pl-3 pr-10 text-eg-text text-sm bg-gray-200 border-gray-300 focus:outline-none focus:ring-eg-lightblue focus:border-eg-lightblue font-normal rounded-md">
              <option value="">Select Option</option>
              <option value="resubmitForSigning">Resubmit for signing</option>
              <option value="downloadAttachments">Download Attachments</option>
              <option value="downloadPdf">Download PDF</option>
              <option value="downloadCertificate">Download Certificate</option>
              <option value="showZohoRequest">Show zoho request</option>
              <option v-if="loanRequestStore.getLoanRequest && loanRequestStore.getLoanRequest.applicationStatus === 'COMPLETED'" value="voidLoanRequest">Void loan request</option>
              <option v-if="loanRequestStore.getLoanRequest && loanRequestStore.getLoanRequest.applicationStatus === 'COMPLETED'" value="submitToCoBanking">Submit to co-banking</option>
            </select>
          </div>
          <div class="bg-white px-4 py-5 shadow sm:rounded-lg sm:px-6">
            <div class="py-5 px-5">
              <h3 class="text-lg font-medium leading-6 text-gray-900">Loan Request Details.</h3>
              <p class="mt-1 max-w-2xl text-sm text-gray-500">Loan Request {{loanRequestStore.getLoanRequest?.loanRequestNumber}} current data.</p>
            </div>
            <div class="flex flex-1 items-stretch overflow-hidden">

              <aside class="flex-1 overflow-y-auto border-gray-200 block relative">
                <div v-if="loanRequestStore.getLoanRequest && loanRequestStore.getLoanRequest.pdfThumbNail" class="px-5">
                  <img
                      :src="`data:image/png;base64,${loanRequestStore.getLoanRequest.pdfThumbNail}`"
                      alt="Loan Application Form"
                      class="w-64"
                  >
                  <button @click="downloadLoanRequestForm" type="button" class="absolute bottom-2 inline-flex items-center justify-center rounded-md border border-transparent bg-eg-lightblue px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-eg-bg focus:outline-none focus:ring-2 focus:ring-eg-bg focus:ring-offset-2 sm:w-64">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                    </svg>
                    DOWNLOAD FORM
                  </button>
                </div>
                <div v-else class="px-5">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-64 h-64 text-red-400">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                  <button @click="openErrorModal = true" type="button" class="absolute bottom-2 inline-flex items-center justify-center rounded-md border border-transparent bg-eg-lightblue px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-eg-bg focus:outline-none focus:ring-2 focus:ring-eg-bg focus:ring-offset-2 sm:w-64">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                    </svg>
                    SHOW ERROR DETAILS
                  </button>

                  <TransitionRoot as="template" :show="openErrorModal">
                    <Dialog as="div" class="relative z-10" @close="openErrorModal = false">
                      <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
                        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                      </TransitionChild>

                      <div class="fixed inset-0 z-10 overflow-y-auto">
                        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                          <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leave-from="opacity-100 translate-y-0 sm:scale-100" leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
                            <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                              <div>
                                <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                                  <ExclamationCircleIcon class="h-6 w-6 text-red-600" aria-hidden="true" />
                                </div>
                                <div class="mt-3 text-center sm:mt-5">
                                  <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">Loan Request Error</DialogTitle>
                                  <div class="mt-2">
                                    <p class="text-sm text-gray-500">
                                      {{ (loanRequestStore.getLoanRequest && loanRequestStore.getLoanRequest.pendingReason) ? loanRequestStore.getLoanRequest.pendingReason : "" }}
                                    </p>
                                    <p class="text-sm text-gray-500">
                                      {{ (loanRequestStore.getLoanRequest && loanRequestStore.getLoanRequest.readableErrorMessage) ? loanRequestStore.getLoanRequest.readableErrorMessage : "" }}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </DialogPanel>
                          </TransitionChild>
                        </div>
                      </div>
                    </Dialog>
                  </TransitionRoot>
                </div>
              </aside>

              <main class="flex-1 overflow-y-auto">
                <section aria-labelledby="primary-heading" class="flex h-full min-w-0 flex-1 flex-col lg:order-last">
                  <h1 id="primary-heading" class="sr-only">loan request details</h1>
                  <dl class="sm:divide-y sm:divide-gray-100">
                    <div class="py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-3 sm:px-6">
                      <dt class="text-sm font-medium text-gray-500">Loan Request No.</dt>
                      <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{{ loanRequestStore.getLoanRequest?.loanRequestNumber }}</dd>
                    </div>
                    <div class="py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-3 sm:px-6">
                      <dt class="text-sm font-medium text-gray-500">Application Date</dt>
                      <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{{ loanRequestStore.getLoanRequest?.loanDate }}</dd>
                    </div>
                    <div class="py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-3 sm:px-6">
                      <dt class="text-sm font-medium text-gray-500">Member No.</dt>
                      <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                        <router-link :to="`/members/${loanRequestStore.getLoanRequest?.memberRefId}/view`" class="underline flex items-center text-eg-bg">
                          {{ loanRequestStore.getLoanRequest?.memberNumber }}
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 ml-2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                          </svg>
                        </router-link>
                      </dd>
                    </div>
                    <div class="py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-3 sm:px-6">
                      <dt class="text-sm font-medium text-gray-500">Full Names</dt>
                      <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                        {{ loanRequestStore.getLoanRequest?.memberFirstName }}
                        {{ loanRequestStore.getLoanRequest?.memberLastName }}
                      </dd>
                    </div>
                    <div class="py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-3 sm:px-6">
                      <dt class="text-sm font-medium text-gray-500">Loan Type</dt>
                      <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                        {{ loanRequestStore.getLoanRequest?.loanProductName }}
                      </dd>
                    </div>
                    <div class="py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-3 sm:px-6">
                      <dt class="text-sm font-medium text-gray-500">Loan Amount</dt>
                      <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                        KES {{ loanRequestStore.getLoanRequest? $filters.currencyKES(loanRequestStore.getLoanRequest.loanAmount) : 0 }}
                      </dd>
                    </div>
                    <div class="py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-3 sm:px-6">
                      <dt class="text-sm font-medium text-gray-500">Total Deposits</dt>
                      <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                        KES {{ loanRequestStore.getLoanRequest? $filters.currencyKES(loanRequestStore.getLoanRequest.totalDeposits) : 0 }}
                      </dd>
                    </div>
                    <div class="py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-3 sm:px-6">
                      <dt class="text-sm font-medium text-gray-500">Guarantors</dt>
                      <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                        {{ loanRequestStore.getLoanRequest && loanRequestStore.getLoanRequest.guarantorList ? loanRequestStore.getLoanRequest.guarantorList.length : 0 }}
                      </dd>
                    </div>
                  </dl>
                </section>
              </main>

              <aside class="flex-1 flex flex-col items-center overflow-y-auto border-gray-200 bg-white block">
                <div class="flex space-x-6">
                  <div class="flex flex-col">
                    <h3 class="text-lg text-gray-500 font-medium">Requested</h3>
                    <p class="text-sm text-eg-bg">KES {{ loanRequestStore.getLoanRequest? $filters.currencyKES(loanRequestStore.getLoanRequest.loanAmount) : 0 }}</p>
                  </div>
                  <div class="flex flex-col">
                    <h3 class="text-lg text-gray-500 font-medium">Deposits</h3>
                    <p class="text-sm text-eg-bg">KES {{ loanRequestStore.getLoanRequest? $filters.currencyKES(loanRequestStore.getLoanRequest.totalDeposits) : 0 }}</p>
                  </div>
                </div>
                <div class="summary mt-14">
                  <div class="tile tileStyle">
                    <svg id="test--svg--0" height="160" width="160">
                      <g :transform="`translate(${160 / 2},${160 / 2})`">
                      </g>
                      <g :transform="`translate(${160 / 2},${160 / 2})`">
                        <text style="text-anchor: middle">
                          <tspan x="0" dy="0" class='summary--tiles--value'>
                            {{ loanRequestStore.getLoanRequest && loanRequestStore.getLoanRequest.loanRequestProgress ? (loanRequestStore.getLoanRequest.loanRequestProgress / 100 * 100).toFixed(2) + '%' : 0 }}
                          </tspan>
                        </text>
                      </g>
                    </svg>
                  </div>
                </div>

                <button @click="otherDetails = !otherDetails" type="button" class="inline-flex mt-14 items-center rounded-md border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-eg-lightblue focus:ring-offset-2 sm:text-sm">
                  Other Details
                  <ChevronDownIcon class="h-4 w-4 ml-2 text-gray-600"/>
                </button>
              </aside>
            </div>
            <Transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
              <div v-if="otherDetails" class="flex flex-1 items-stretch overflow-hidden mt-6">
                <form @submit.prevent="saveLRDetails">
                  <main class="flex-1 overflow-y-auto">
                    <section aria-labelledby="primary-heading" class="flex h-full min-w-0 flex-1 flex-col lg:order-last">
                      <div class="flex">
                        <h6 class="py-2 sm:py-3 sm:px-6 font-medium text-base">Other details</h6>
                        <div class="flex items-center justify-center bg-white hidden">
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
                          <div v-for="(key, i) in LRDetails" :key="key+i" class="py-2 sm:grid sm:grid-cols-4 sm:gap-4 sm:py-3 sm:px-6">
                            <dt class="text-sm font-medium text-gray-500">
                              <div class="border-b border-gray-300 focus-within:border-eg-bgopacity">
                                <input disabled :value="key" type="text" class="block w-full border-0 border-b border-transparent bg-gray-200 cursor-not-allowed focus:ring-eg-lightblue focus:border-eg-bgopacity focus:ring-0 sm:text-sm" placeholder="key" />
                              </div>
                            </dt>
                            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
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
              <h3 class="text-lg font-medium leading-6 text-gray-900">Witnesses</h3>
            </div>
            <table class="min-w-full divide-y divide-gray-300">
              <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="whitespace-nowrap py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Member No.</th>
                <th scope="col" class="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">Member</th>
                <th scope="col" class="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
              </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white">
              <tr>
                <td class="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-6">
                  <router-link v-if="loanRequestStore.getLoanRequest?.witnessRefId" :to="`/members/${loanRequestStore.getLoanRequest?.witnessRefId}/view`" class="underline flex items-center text-eg-bg">
                    {{ loanRequestStore.getLoanRequest?.witnessMemberNo }}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 ml-2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                    </svg>
                  </router-link>
                </td>
                <td class="whitespace-nowrap px-2 py-2 text-sm font-medium text-gray-900">{{ loanRequestStore.getLoanRequest && loanRequestStore.getLoanRequest.witnessName ? loanRequestStore.getLoanRequest.witnessName : '' }}</td>
                <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-500 w-1/3">
                  <div v-if="loanRequestStore.getLoanRequest && loanRequestStore.getLoanRequest.witnessMemberNo" class="flex items-center relative">
                    <div class="w-full border border-eg-lightblue h-2 rounded-full flex">
                      <div :style="{ width: hrWidth2() + '%' }" class="bg-eg-lightblue"></div>
                    </div>

                    <div class="w-4 bg-eg-lightblue h-4 left-0 rounded-full absolute"></div>
                    <span class="left-0 rounded-full mt-10 -ml-5 text-xxs text-eg-lightblue absolute">Accepted</span>
                    <div class="w-4 bg-eg-lightblue h-4 right-0 rounded-full absolute"></div>
                    <span class="right-0 rounded-full mt-10 -ml-2 text-xxs text-eg-lightblue absolute">Signed</span>
                  </div>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
          <div class="bg-white px-4 py-5 shadow sm:rounded-lg sm:px-6">
            <div class="px-4 py-5 sm:px-6">
              <h3 class="text-lg font-medium leading-6 text-gray-900">Guarantors</h3>
            </div>
            <table class="min-w-full divide-y divide-gray-300">
              <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="whitespace-nowrap py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Member No.</th>
                <th scope="col" class="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">Member</th>
                <th scope="col" class="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">Committed</th>
                <th scope="col" class="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">Available</th>
                <th scope="col" class="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">Required</th>
                <th scope="col" class="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
              </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white">
                <tr v-for="guarantor in loanRequestStore.getLoanRequest?.guarantorList" :key="guarantor.refId">
                  <td class="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-6">
                    <router-link v-if="guarantor.memberRefId" :to="`/members/${guarantor.memberRefId}/view`" class="underline flex items-center text-eg-bg">
                      {{ guarantor.memberNumber }}
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 ml-2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                      </svg>
                    </router-link>
                  </td>
                  <td class="whitespace-nowrap px-2 py-2 text-sm font-medium text-gray-900">
                    <button @click="setGuarantorToApprove(guarantor)" type="button">
                      {{ guarantor.firstName }} {{ guarantor.lastName }}
                    </button>
                  </td>
                  <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-900">
                    <button @click="setGuarantorToApprove(guarantor)" type="button">
                      {{ guarantor.committedAmount ? $filters.currencyKES(guarantor.committedAmount) : guarantor.committedAmount }}
                    </button>
                  </td>
                  <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                    <button @click="setGuarantorToApprove(guarantor)" type="button">
                      {{ guarantor.availableAmount ? $filters.currencyKES(guarantor.availableAmount) : guarantor.availableAmount }}
                    </button>
                  </td>
                  <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                    <button @click="setGuarantorToApprove(guarantor)" type="button">
                      {{ $filters.currencyKES(guarantor.availableAmount - guarantor.committedAmount) }}
                    </button>
                  </td>
                  <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-500 w-1/3">
                    <div @click="setGuarantorToApprove(guarantor)" class="flex items-center relative">
                      <div class="w-full border border-eg-lightblue h-2 rounded-full flex">
                        <div :style="{ width: hrWidth(guarantor) + '%' }" class="bg-eg-lightblue"></div>
                      </div>

                      <div class="w-4 bg-eg-lightblue h-4 left-0 rounded-full absolute"></div>
                      <span class="left-0 rounded-full mt-10 -ml-5 text-xxs text-eg-lightblue absolute">Accepted</span>
                      <div class="w-4 bg-eg-lightblue h-4 left-1/2 rounded-full absolute"></div>
                      <span class="left-1/2 rounded-full mt-10 -ml-2 text-xxs text-eg-lightblue absolute">Signed</span>
                      <div class="w-4 bg-eg-lightblue h-4 right-0 rounded-full absolute"></div>
                      <span class="right-0 rounded-full mt-10 -mr-5 text-xxs text-eg-lightblue absolute">Approved</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <button v-if="loanRequestStore.getLoanRequest && loanRequestStore.getLoanRequest.applicationStatus === 'COMPLETED'" @click="submitToCoBanking" type="button" class="inline-flex items-center rounded-md border border-transparent bg-eg-bgopacity px-4 py-2 text-sm font-medium text-eg-bg hover:bg-eg-lightblue focus:outline-none focus:ring-2 focus:ring-eg-lightblue focus:ring-offset-2 mt-14">
              Submit Loan Form
            </button>

            <TransitionRoot as="template" :show="guarantorApprovalOpen">
              <Dialog as="div" class="relative z-10" @close="guarantorApprovalOpen = false">
                <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
                  <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </TransitionChild>

                <div class="fixed inset-0 z-10 overflow-y-auto">
                  <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leave-from="opacity-100 translate-y-0 sm:scale-100" leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
                      <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                        <div class="absolute top-0 right-0 hidden pt-4 pr-4 sm:block">
                          <button type="button" class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2" @click="guarantorApprovalOpen = false">
                            <span class="sr-only">Close</span>
                            <XMarkIcon class="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                        <div>
                          <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">Guarantor Approval</DialogTitle>
                          <dl class="sm:divide-y sm:divide-gray-100">
                            <div class="py-2 sm:grid sm:grid-cols-2 sm:gap-4 sm:py-3">
                              <dt class="text-sm font-medium text-gray-500">Name</dt>
                              <dd class="mt-1 text-sm text-gray-900 sm:mt-0">
                                {{ selectedGuarantor?.firstName }}
                                <br>
                                {{ selectedGuarantor?.lastName }}
                              </dd>
                            </div>
                            <div class="py-2 sm:grid sm:grid-cols-2 sm:gap-4 sm:py-3">
                              <dt class="text-sm font-medium text-gray-500">Member No.</dt>
                              <dd class="mt-1 text-sm text-gray-900 sm:mt-0">
                                {{ selectedGuarantor?.memberNumber }}
                              </dd>
                            </div>
                            <div class="py-2 sm:grid sm:grid-cols-2 sm:gap-4 sm:py-3">
                              <dt class="text-sm font-medium text-gray-500">Deposits</dt>
                              <dd class="mt-1 text-sm text-gray-900 sm:mt-0">
                                {{ $filters.currencyKES(selectedGuarantor?.totalDeposits) }}
                              </dd>
                            </div>
                            <div class="py-2 sm:grid sm:grid-cols-2 sm:gap-4 sm:py-3">
                              <dt class="text-sm font-medium text-gray-500">Committed</dt>
                              <dd class="mt-1 text-sm text-gray-900 sm:mt-0">
                                {{ $filters.currencyKES(selectedGuarantor?.committedAmount) }}
                              </dd>
                            </div>
                            <div class="py-2 sm:grid sm:grid-cols-2 sm:gap-4 sm:py-3">
                              <dt class="text-sm font-medium text-gray-500">Available</dt>
                              <dd class="mt-1 text-sm text-gray-900 sm:mt-0">
                                {{ $filters.currencyKES(selectedGuarantor?.availableAmount) }}
                              </dd>
                            </div>
                            <div class="py-2 sm:grid sm:grid-cols-2 sm:gap-4 sm:py-3">
                              <dt class="text-sm font-medium text-gray-500">Required</dt>
                              <dd class="mt-1 text-sm text-gray-900 sm:mt-0">
                                {{ selectedGuarantor ? $filters.currencyKES(selectedGuarantor?.availableAmount - selectedGuarantor?.committedAmount) : 0 }}
                              </dd>
                            </div>
                          </dl>
                        </div>
                        <div class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                          <button type="button" class="inline-flex w-full justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm" @click="approveGuarantor(true)">Approve</button>
                          <button type="button" class="mt-3 inline-flex w-full justify-center rounded-md border border-transparent bg-red-400 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-red-200 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm" @click="approveGuarantor(false)" ref="cancelButtonRef">Decline</button>
                        </div>
                      </DialogPanel>
                    </TransitionChild>
                  </div>
                </div>
              </Dialog>
            </TransitionRoot>
          </div>
          <TransitionRoot as="template" :show="zohoRequestOpen">
            <Dialog as="div" class="relative z-10" @close="zohoRequestOpen = false">
              <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
                <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
              </TransitionChild>

              <div class="fixed inset-0 z-10 overflow-y-auto">
                <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                  <TransitionChild
                      as="template"
                      enter="ease-out duration-300"
                      enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                      enter-to="opacity-100 translate-y-0 sm:scale-100"
                      leave="ease-in duration-200"
                      leave-from="opacity-100 translate-y-0 sm:scale-100"
                      leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  >
                    <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-5xl sm:p-6">
                      <div class="absolute top-0 right-0 hidden pt-4 pr-4 sm:block">
                        <button type="button" class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2" @click="zohoRequestOpen = false">
                          <span class="sr-only">Close</span>
                          <XMarkIcon class="h-6 w-6" aria-hidden="true" />
                        </button>
                      </div>
                      <div class="sm:flex sm:items-start">
                        <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left overflow-hidden">
                          <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">Zoho Request Detail</DialogTitle>
                          <div class="mt-2 space-y-4">
                            <div class="text-sm text-gray-500">
                              <span class="font-semibold">Actions:</span>
                              <div class="overflow-x-scroll">
                                <table class="mt-6">
                                  <thead class="bg-gray-50">
                                  <tr>
                                    <th scope="col" class="whitespace-nowrap py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">ROLE</th>
                                    <th scope="col" class="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">ACTION ID</th>
                                    <th scope="col" class="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">ACTION TYPE</th>
                                    <th scope="col" class="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">RECIPIENT NAME</th>
                                    <th scope="col" class="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">RECIPIENT PHONE NO.</th>
                                    <th scope="col" class="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">RECIPIENT EMAIL</th>
                                    <th scope="col" class="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">PRIVATE NOTES</th>
                                    <th scope="col" class="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">VERIFY RECIPIENT</th>
                                    <th scope="col" class="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">VERIFICATION TYPE</th>
                                  </tr>
                                  </thead>
                                  <tbody class="divide-y divide-gray-200 bg-white">
                                  <!--                                {action_id: string, action_type: string, is_embedded: boolean, private_notes: string, recipient_email: string, recipient_name: string, recipient_phonenumber: string, role: string, verification_type: string, verify_recipient: boolean}-->
                                  <tr v-for="action in zohoRequest.templates.actions" :key="action.action_id">
                                    <td class="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-6">{{ action.role }}</td>
                                    <td class="whitespace-nowrap px-2 py-2 text-sm font-medium text-gray-900">{{ action.action_id }}</td>
                                    <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-900">{{ action.action_type }}</td>
                                    <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{{ action.recipient_name }}</td>
                                    <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{{ action.recipient_phonenumber }}</td>
                                    <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{{ action.recipient_email }}</td>
                                    <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{{ action.private_notes }}</td>
                                    <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{{ action.verify_recipient }}</td>
                                    <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{{ action.verification_type }}</td>
                                  </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                            <div class="space-y-2">
                              <div class="text-sm text-gray-500">
                                <span class="font-semibold">Field Text Data:</span>
                                <div v-for="(key, i) in Object.keys(zohoRequest.templates.field_data.field_text_data)" :key="key+i" class="py-2 sm:grid sm:grid-cols-4 sm:gap-4 sm:py-3">
                                  <dt class="text-sm font-medium text-gray-500">
                                    <div class="border-b border-gray-300 focus-within:border-eg-bgopacity">
                                      <input disabled :value="key" type="text" class="block w-full border-0 border-b border-transparent bg-gray-200 cursor-not-allowed focus:ring-eg-lightblue focus:border-eg-bgopacity focus:ring-0 sm:text-sm" placeholder="key" />
                                    </div>
                                  </dt>
                                  <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    <div class="border-b border-gray-300 focus-within:border-eg-bgopacity mt-1 sm:mt-0">
                                      <input disabled :value="zohoRequest.templates.field_data.field_text_data[key]" type="text" class="block w-full border-0 border-b border-transparent bg-gray-50 focus:ring-eg-lightblue focus:border-eg-bgopacity focus:ring-0 sm:text-sm" placeholder="value" />
                                    </div>
                                  </dd>
                                </div>
                              </div>
                              <div class="text-sm text-gray-500">
                                <span class="font-semibold">Field Date Data:</span>
                                <div v-for="(key, i) in Object.keys(zohoRequest.templates.field_data.field_date_data)" :key="key+i" class="py-2 sm:grid sm:grid-cols-4 sm:gap-4 sm:py-3">
                                  <dt class="text-sm font-medium text-gray-500">
                                    <div class="border-b border-gray-300 focus-within:border-eg-bgopacity">
                                      <input disabled :value="key" type="text" class="block w-full border-0 border-b border-transparent bg-gray-200 cursor-not-allowed focus:ring-eg-lightblue focus:border-eg-bgopacity focus:ring-0 sm:text-sm" placeholder="key" />
                                    </div>
                                  </dt>
                                  <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    <div class="border-b border-gray-300 focus-within:border-eg-bgopacity mt-1 sm:mt-0">
                                      <input disabled :value="zohoRequest.templates.field_data.field_date_data[key]" type="text" class="block w-full border-0 border-b border-transparent bg-gray-50 focus:ring-eg-lightblue focus:border-eg-bgopacity focus:ring-0 sm:text-sm" placeholder="value" />
                                    </div>
                                  </dd>
                                </div>
                              </div>
                              <div class="text-sm text-gray-500">
                                <span class="font-semibold">Field Boolean Data:</span>
                                <div v-for="(key, i) in Object.keys(zohoRequest.templates.field_data.field_boolean_data)" :key="key+i" class="py-2 sm:grid sm:grid-cols-4 sm:gap-4 sm:py-3">
                                  <dt class="text-sm font-medium text-gray-500">
                                    <div class="border-b border-gray-300 focus-within:border-eg-bgopacity">
                                      <input disabled :value="key" type="text" class="block w-full border-0 border-b border-transparent bg-gray-200 cursor-not-allowed focus:ring-eg-lightblue focus:border-eg-bgopacity focus:ring-0 sm:text-sm" placeholder="key" />
                                    </div>
                                  </dt>
                                  <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    <div class="border-b border-gray-300 focus-within:border-eg-bgopacity mt-1 sm:mt-0">
                                      <input disabled :value="zohoRequest.templates.field_data.field_boolean_data[key]" type="text" class="block w-full border-0 border-b border-transparent bg-gray-50 focus:ring-eg-lightblue focus:border-eg-bgopacity focus:ring-0 sm:text-sm" placeholder="value" />
                                    </div>
                                  </dd>
                                </div>
                              </div>
                              <div class="text-sm text-gray-500">
                                <span class="font-semibold">Request name:</span>
                                <p class="text-sm text-gray-500">{{ zohoRequest.templates.request_name }}</p>
                              </div>
                              <div class="text-sm text-gray-500">
                                <span class="font-semibold">Notes:</span>
                                <p class="text-sm text-gray-500">{{ zohoRequest.templates.notes }}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                        <button type="button" class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm" @click="zohoRequestOpen = false">Cancel</button>
                      </div>
                    </DialogPanel>
                  </TransitionChild>
                </div>
              </div>
            </Dialog>
          </TransitionRoot>
        </div>
      </div>
    </main>
  </div>
</template>
<style scoped>
.tile {
  width: 500px;
  height: 250px;
  display: flex;
  flex-direction: column;
}
.tileStyle {
  width: 180px;
  height: 180px;
  flex-shrink: 0;
  border-radius: 50%;
  align-items: center;
  justify-content: center;
}
.summary--tiles--value {
  font-family: 'Montserrat', sans-serif;
  font-size: 25px;
  fill: #707173
}
</style>