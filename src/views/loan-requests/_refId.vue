<template>
  <div class="w-full pt-16 pb-32">
    <div class="space-y-3 sm:px-6 lg:px-5">
      <div class="flex justify-between items-center">
        <Breadcrumb pageName="" linkName="All Loan Requests" linkUrl="/loan-requests"  :current="`Request ${loanRequestStore.getLoanRequest?.loanRequestNumber}`"/>
      </div>
      <div class="bg-white px-4 py-5 shadow sm:rounded-lg sm:px-6">
        <div class="px-4 py-5 sm:px-6">
          <h3 class="text-lg font-medium leading-6 text-gray-900">Member Details</h3>
          <p class="mt-1 max-w-2xl text-sm text-gray-500">Loan Request {{loanRequestStore.getLoanRequest?.loanRequestNumber}} current data.</p>
        </div>
        <div class="flex flex-1 items-stretch overflow-hidden">
          <main class="flex-1 overflow-y-auto">
            <section aria-labelledby="primary-heading" class="flex h-full min-w-0 flex-1 flex-col lg:order-last">
              <h1 id="primary-heading" class="sr-only">loan request details</h1>
              <dl class="sm:divide-y sm:divide-gray-200">
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
                  <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{{ loanRequestStore.getLoanRequest?.memberFirstName }} {{ loanRequestStore.getLoanRequest?.memberLastName }}</dd>
                </div>
                <div class="py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-3 sm:px-6">
                  <dt class="text-sm font-medium text-gray-500">Loan Type</dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{{ loanRequestStore.getLoanRequest?.loanProductName }}</dd>
                </div>
                <div class="py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-3 sm:px-6">
                  <dt class="text-sm font-medium text-gray-500">Loan Amount</dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">KES {{ loanRequestStore.getLoanRequest? $filters.currencyKES(loanRequestStore.getLoanRequest.loanAmount) : 0 }}</dd>
                </div>
                <div class="py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-3 sm:px-6">
                  <dt class="text-sm font-medium text-gray-500">Total Deposits</dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">KES {{ loanRequestStore.getLoanRequest? $filters.currencyKES(loanRequestStore.getLoanRequest.totalDeposits) : 0 }}</dd>
                </div>
                <div class="py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-3 sm:px-6">
                  <dt class="text-sm font-medium text-gray-500">Guarantors</dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{{ loanRequestStore.getLoanRequest?.loanRequestNumber }}</dd>
                </div>
              </dl>
            </section>
          </main>
          <aside class="flex-1 overflow-y-auto border-l border-gray-200 bg-white block">
            <dl class="sm:divide-y sm:divide-gray-200">

            </dl>
          </aside>
          <aside class="flex-1 overflow-y-auto border-l border-gray-200 bg-white block">
            <dl class="sm:divide-y sm:divide-gray-200">

            </dl>
          </aside>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import * as d3 from 'd3'
  import stores from "../../stores";
  import {useRoute, useRouter} from "vue-router";
  import {onMounted} from "vue";
  import Breadcrumb from "../../components/Breadcrumb.vue";
  const { loanRequestStore, authStore } = stores;
  const router = useRouter();
  const route = useRoute();

  onMounted(async () => {
    await Promise.all([
      loanRequestStore.fetchLoanRequest(`${route.params.refId}`)
    ])

    /*addArc();
    addArc().remove();
    addArc()
        .transition()
        .duration(750)
        .call(arcTween, (2 * Math.PI) * loanRequestStore.getLoanRequest?., this.arc());*/
  })

  /*const arcTween = (transition, newAngle, arc) => {
    transition.attrTween('d', (d) => {
      const interpolate = d3.interpolate(d.endAngle, newAngle);
      const newArc = d;
      return (t) => {
        newArc.endAngle = interpolate(t);
        return arc(newArc);
      };
    });
  };

  const arc: any = () => {
    let {width, height, pathStyle} = {
      height: 140,
      width: 140,
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

  const getSVG = () => {
    return (
        d3.select(`#test--svg--getSVG}`).select('g')
    )
  };

  const addArc = () => {
    return (
        getSVG().append("path")
            .datum({endAngle: 0})
            .style("fill", "#000000")
            .attr("d", arc())
    )
  };*/


</script>