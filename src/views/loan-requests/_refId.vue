<template>
  <div class="w-full pt-16 pb-32">
    <div class="space-y-3 sm:px-6 lg:px-5">
      <div class="flex justify-between items-center">
        <Breadcrumb pageName="" linkName="All Loan Requests" linkUrl="/loan-requests"  :current="`Request ${loanRequestStore.getLoanRequest?.loanRequestNumber}`"/>
        <div class="flex items-center space-x-4">
          <span>Action</span>
          <select v-model="action" class="block h-8 mr-5 pl-3 pr-10 text-eg-text bg-gray-200 border-gray-300 focus:outline-none focus:ring-eg-lightblue focus:border-eg-lightblue text-xs font-normal rounded-md">
            <option value="">Select Option</option>
            <option value="resubmitForSigning">Resubmit for signing</option>
            <option value="downloadAttachments">Download Attachments</option>
            <option value="downloadPdf">Download PDF</option>
            <option value="downloadCertificate">Download Certificate</option>
            <option value="showZohoRequest">Show zoho request</option>
            <option value="submitToCoBanking">Submit to co-banking</option>
          </select>
        </div>
      </div>
      <div class="bg-white px-4 py-5 shadow sm:rounded-lg sm:px-6">
        <div class="py-5 px-5">
          <h3 class="text-lg font-medium leading-6 text-gray-900">Member Details</h3>
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
              <p>
                {{ (loanRequestStore.getLoanRequest && loanRequestStore.getLoanRequest.pendingReason) ? loanRequestStore.getLoanRequest.pendingReason : "" }}
              </p>
              <p>
                {{ (loanRequestStore.getLoanRequest && loanRequestStore.getLoanRequest.readableErrorMessage) ? loanRequestStore.getLoanRequest.readableErrorMessage : "" }}
              </p>
              <p>Suggestion: Kindly Re-submit for signing.</p>
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
                    {{ loanRequestStore.getLoanRequest?.guarantorCount }}
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
          </aside>
        </div>
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
            <td class="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-6">{{ loanRequestStore.getLoanRequest && loanRequestStore.getLoanRequest.witnessMemberNo ? loanRequestStore.getLoanRequest.witnessMemberNo : '' }}</td>
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
            <td class="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-6">{{ guarantor.memberNumber }}</td>
            <td class="whitespace-nowrap px-2 py-2 text-sm font-medium text-gray-900">{{ guarantor.firstName }} {{ guarantor.lastName }}</td>
            <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-900">{{ guarantor.committedAmount }}</td>
            <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{{ guarantor.availableAmount }}</td>
            <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{{ guarantor.status }}</td>
            <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-500 w-1/3">
              <div class="flex items-center relative">
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
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import * as d3 from 'd3'
  import stores from "../../stores";
  import {useRoute, useRouter} from "vue-router";
  import {onMounted, ref, watch} from "vue";
  import Breadcrumb from "../../components/Breadcrumb.vue";
  import {GuarantorData} from "../../stores/loan-request-store";
  const { loanRequestStore, authStore } = stores;
  const router = useRouter();
  const route = useRoute();

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

  const disabledPDF = ref<boolean>(false)

  const documentDetails = ref<any[]>([])

  const downloadLoanRequestForm = async () => {
    if (disabledPDF.value === false) {
      disabledPDF.value = true
      const [downloaded] = await Promise.allSettled([
        loanRequestStore.downloadLoanRequestForm({
          zohoRequestId: `${loanRequestStore.getLoanRequest?.zohoRequestId}`
        })
      ])

      if (downloaded.status === 'fulfilled') {
        documentDetails.value.push(downloaded.value);
        await downloadPdf('Completion Certificate', documentDetails.value.pop());
        disabledPDF.value = false;
        authStore.defineNotification({
          id: (Math.random().toString(36) + Date.now().toString(36)).substring(2),
          message: 'Downloaded request form successful!',
          success: true
        });
      } else {
        authStore.defineNotification({
          id: (Math.random().toString(36) + Date.now().toString(36)).substring(2),
          message: 'Could not download request form!',
          error: true
        });
        disabledPDF.value = false;
      }
    } else {
      authStore.defineNotification({
        id: (Math.random().toString(36) + Date.now().toString(36)).substring(2),
        message: 'Processing, please wait!',
        warning: true
      })
    }
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

  const submitToCoBanking = async () => {
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
        message: 'Could not download pdf!',
        error: true
      })
    }
  };

  const closeLRequest = async (value: any) => {
    // close, then move to next, close only if 100%
    // eslint-disable-next-line brace-style
    /*if (this.loanRequestDetails.loanRequestProgress !== 100) {
      if (window.confirm(`You are about to close an incomplete loan request ${this.loanRequestDetails.loanRequestNumber}, continue?`)) {
        await this.postToCoBanking()
      }
    } else {
      const closeRequest = window.confirm(`Are you sure you want to close loan request number: ${this.loanRequestDetails.loanRequestNumber}?`)
      if (closeRequest === true) {
        /!*await axios.post(`/loan-request/${this.loanRequestDetails.refId}/status/CLOSED`, {})
          .then(async response1 => {
            if (response1.data.status === 'CLOSED') { // move to next loan request
              const newRefId = value.pop().refId // pop refid to avoid reloading same data
              await this.makeGetRequest(newRefId)
            }
          }).catch(error => {
            this.$toasted.error(error)
          })*!/
        await this.postToCoBanking()
      }
    }*/
  }

  const action = ref('')

  watch(() => action.value, async (actions) => {
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
        break;
      case 'submitToCoBanking':
        await submitToCoBanking();
        break;
    }
  })

</script>
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