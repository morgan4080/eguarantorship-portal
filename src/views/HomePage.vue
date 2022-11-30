<script setup lang="ts">
import * as d3 from 'd3';
import Breadcrumb from "../components/Breadcrumb.vue";
import {computed, ref, onMounted} from "vue";
import stores from "../stores";
const authStore = stores.authStore;
const loanRequests = computed(() => authStore.getLoanRequests ? authStore.getLoanRequests : [
  {
    memberFirstName: 'MORGAN',
    memberLastName: 'MUTUGI MURUNGI',
    loanAmount: 500000,
    loanProductName: 'Inua Loan'
  },
  {
    memberFirstName: 'MORGAN',
    memberLastName: 'MUTUGI MURUNGI',
    loanAmount: 500000,
    loanProductName: 'Inua Loan'
  },
  {
    memberFirstName: 'MORGAN',
    memberLastName: 'MUTUGI MURUNGI',
    loanAmount: 500000,
    loanProductName: 'Inua Loan'
  },
  {
    memberFirstName: 'MORGAN',
    memberLastName: 'MUTUGI MURUNGI',
    loanAmount: 500000,
    loanProductName: 'Inua Loan'
  },
  {
    memberFirstName: 'MORGAN',
    memberLastName: 'MUTUGI MURUNGI',
    loanAmount: 500000,
    loanProductName: 'Inua Loan'
  },
  {
    memberFirstName: 'MORGAN',
    memberLastName: 'MUTUGI MURUNGI',
    loanAmount: 500000,
    loanProductName: 'Inua Loan'
  }
]);
const hrWidth = (step: number = 0) => {
  return (step * 100) / 3
};

const filter = ref('Past Week')

const data = [2,4,6,8,10,14,20]

const targetD3 = ref(null)

const targetD30 = ref(null)

onMounted(() => {
  if (targetD3.value) {
    (() => {
      let svg = d3.select(targetD3.value)
      let width: any = svg.attr('width')
      let height: any = svg.attr('height')
      let radius = Math.min(width, height) / 2
      let g = svg.append('g').attr('transform', "translate(" + width / 2 + "," + height / 2 +")")
      // create ordinal scale
      let color = d3.scaleOrdinal(['#e40303', '#ff8c00', '#008026','#004dff', '#750787']);
      // create pie
      let pie = d3.pie()
      // create arc
      let arc: any = d3.arc()
          .innerRadius(radius/2)
          .outerRadius(radius)
      // create arcs
      let arcs = g.selectAll('arc')
          .data(pie(data))
          .enter().append('g')
          .attr('class', 'arc')
      // append path
      arcs.append('path')
          .attr('fill', (d, i: any) => color(i))
          .attr('d', arc);
      let textContainer = g.append('g');
      let text = textContainer.append('text');
      text.attr("transform", function() {
        let centroid = arc.centroid({startAngle: ((radius/2)+radius)/2, endAngle: ((radius/2)+radius)/2})
        return "translate(" + centroid[0] + "," + 0 + ")";
      }).attr('class', 'text-sm fill-eg-bg').text('Total');
      let text2 = textContainer.append('text');
      text2.attr("transform", function() {
        let centroid = arc.centroid({startAngle: ((radius/2)+radius)/2, endAngle: ((radius/2)+radius)/2})
        return "translate(" + centroid[0] + "," + 15 + ")";
      }).attr('class', 'text-xxs font-semibold fill-red-500').text('KES 32M');
    })()
  }
  if (targetD30.value) {
    (() => {
      let svg = d3.select(targetD30.value)
      let width: any = svg.attr('width')
      let height: any = svg.attr('height')
      let radius = Math.min(width, height) / 2
      let g = svg.append('g').attr('transform', "translate(" + width / 2 + "," + height / 2 +")")
      // create ordinal scale
      let color = d3.scaleOrdinal(['#e40303', '#ff8c00', '#008026','#004dff', '#750787']);
      // create pie
      let pie = d3.pie()
      // create arc
      let arc: any = d3.arc()
          .innerRadius(radius/2)
          .outerRadius(radius)
      // create arcs
      let arcs = g.selectAll('arc')
          .data(pie(data))
          .enter().append('g')
          .attr('class', 'arc')
      // append path
      arcs.append('path')
          .attr('fill', (d, i: any) => color(i))
          .attr('d', arc);
      let textContainer = g.append('g');
      let text = textContainer.append('text');
      text.attr("transform", function() {
        let centroid = arc.centroid({startAngle: ((radius/2)+radius)/2, endAngle: ((radius/2)+radius)/2})
        return "translate(" + centroid[0] + "," + 0 + ")";
      }).attr('class', 'text-sm fill-eg-bg').text('Total');
      let text2 = textContainer.append('text');
      text2.attr("transform", function() {
        let centroid = arc.centroid({startAngle: ((radius/2)+radius)/2, endAngle: ((radius/2)+radius)/2})
        return "translate(" + centroid[0] + "," + 15 + ")";
      }).attr('class', 'text-xxs font-semibold fill-red-500').text('KES 20M');
    })()
  }
})

</script>
<template>
  <div class="w-full pt-16 pb-32">
    <div class="space-y-6 sm:px-6 lg:px-5">
      <div class="flex justify-between items-center">
        <Breadcrumb pageName="Dashboard" linkName="Dashboard" linkUrl="/"  current="General"/>
        <select class="block h-8 mr-5 pl-3 pr-10 text-eg-text bg-gray-200 border-gray-300 focus:outline-none focus:ring-amber-500 focus:border-amber-500 text-xs font-normal rounded-md">
          <option selected>Past Week</option>
          <option>Past Month</option>
          <option>Past Year</option>
        </select>
      </div>
      <div class="sm:grid sm:gap-8 sm:grid-cols-2 text-eg-text">
        <div class="sm:grid sm:grid-cols-2 sm:gap-4">
          <div class="bg-white border border-gray-200 shadow rounded-md px-4 py-6 flex flex-col justify-center">
            <div class="flex-1 flex justify-between items-start">
              <div class="flex flex-col space-y-2">
                <span class="font-semibold text-2xl">20</span>
                <span class="uppercase text-sm font-medium">Total Requests</span>
              </div>
              <svg class="w-10" width="61" height="51" viewBox="0 0 61 51" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="21.0477" cy="11.3191" r="7.2381" fill="#FFBD14"/>
                <circle cx="37.8094" cy="40.2713" r="3.42857" fill="#5992A6"/>
                <circle cx="46.9525" cy="40.2713" r="3.42857" fill="#5992A6"/>
                <circle cx="56.0953" cy="40.2713" r="3.42857" fill="#5992A6"/>
                <path d="M60.4705 23.9708C60.3255 23.6171 59.984 23.3866 59.6051 23.3866H55.6383C54.4836 12.2013 46.2124 2.89625 35.2497 0.591049C34.783 0.493655 34.3177 0.764522 34.169 1.22217L32.9907 4.8452C32.8163 5.38116 33.1604 5.96718 33.7082 6.0707C42.2737 7.6906 48.8341 14.7356 49.9793 23.3866H45.4752C44.6586 23.3866 44.2349 24.4181 44.8128 25.0021L51.8778 32.1396C52.2387 32.5041 52.8416 32.5041 53.2024 32.1396L60.2675 25.0021C60.5354 24.7313 60.6156 24.3245 60.4705 23.9708Z" fill="#00AB71"/>
                <path d="M27.6835 45.1362C19.118 43.5165 12.5576 36.4713 11.4124 27.8204H15.9166C16.7332 27.8204 17.1569 26.7889 16.579 26.2048L9.514 19.0674C9.14831 18.6979 8.55519 18.6979 8.18939 19.0674L1.1242 26.2047C0.546352 26.7886 0.969975 27.8203 1.78656 27.8203H5.75339C6.90803 39.0056 15.1793 48.3106 26.1419 50.6158C26.6031 50.7123 27.0758 50.4366 27.2228 49.9846L28.401 46.3616C28.5754 45.8258 28.2313 45.2398 27.6835 45.1362Z" fill="#FE541F"/>
              </svg>
            </div>
            <div class="flex justify-end pt-2">
              <span class="font-light text-sm rounded-md bg-green-200 text-green-600 border border-green-600 p-2 tracking-wider">+3</span>
            </div>
          </div>
          <div class="bg-white border border-gray-200 shadow rounded-md px-4 py-6 flex flex-col justify-center">
            <div class="flex-1 flex justify-between items-start">
              <div class="flex flex-col space-y-2">
                <span class="font-semibold text-2xl">82000</span>
                <span class="uppercase text-sm font-medium">Total Amount Requested</span>
              </div>

              <svg class="w-10" width="58" height="61" viewBox="0 0 58 61" fill="none" xmlns="http://www.w3.org/2000/svg">
                <mask id="mask0_89_1150" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="28" y="30" width="30" height="31">
                  <rect x="28.6216" y="30.9397" width="29.3687" height="29.3687" fill="#D9D9D9"/>
                </mask>
                <g mask="url(#mask0_89_1150)">
                  <path d="M51.8717 48.0714C51.525 48.0714 51.2346 47.954 51.0005 47.719C50.7655 47.4849 50.648 47.1945 50.648 46.8477V44.4003H48.2007C47.8539 44.4003 47.5635 44.2829 47.3294 44.0479C47.0944 43.8138 46.977 43.5234 46.977 43.1766C46.977 42.8299 47.0944 42.5391 47.3294 42.3042C47.5635 42.07 47.8539 41.953 48.2007 41.953H50.648V39.5056C50.648 39.1588 50.7655 38.868 51.0005 38.6331C51.2346 38.3989 51.525 38.2819 51.8717 38.2819C52.2185 38.2819 52.5089 38.3989 52.743 38.6331C52.978 38.868 53.0954 39.1588 53.0954 39.5056V41.953H55.5428C55.8895 41.953 56.18 42.07 56.4141 42.3042C56.6491 42.5391 56.7665 42.8299 56.7665 43.1766C56.7665 43.5234 56.6491 43.8138 56.4141 44.0479C56.18 44.2829 55.8895 44.4003 55.5428 44.4003H53.0954V46.8477C53.0954 47.1945 52.978 47.4849 52.743 47.719C52.5089 47.954 52.2185 48.0714 51.8717 48.0714ZM39.6348 45.624C38.2887 45.624 37.1364 45.1448 36.1778 44.1862C35.2193 43.2276 34.74 42.0753 34.74 40.7293C34.74 39.3832 35.2193 38.2309 36.1778 37.2723C37.1364 36.3138 38.2887 35.8345 39.6348 35.8345C40.9808 35.8345 42.1332 36.3138 43.0917 37.2723C44.0503 38.2309 44.5296 39.3832 44.5296 40.7293C44.5296 42.0753 44.0503 43.2276 43.0917 44.1862C42.1332 45.1448 40.9808 45.624 39.6348 45.624ZM31.0689 55.4136C30.7222 55.4136 30.4318 55.2961 30.1976 55.0612C29.9627 54.8271 29.8452 54.5366 29.8452 54.1899V51.9873C29.8452 51.2938 30.0239 50.6563 30.3812 50.0746C30.7377 49.4938 31.2117 49.0504 31.8031 48.7445C33.0676 48.1122 34.3525 47.6378 35.6578 47.3213C36.963 47.0056 38.2887 46.8477 39.6348 46.8477C40.9808 46.8477 42.3065 47.0056 43.6118 47.3213C44.9171 47.6378 46.202 48.1122 47.4664 48.7445C48.0579 49.0504 48.5319 49.4938 48.8884 50.0746C49.2457 50.6563 49.4244 51.2938 49.4244 51.9873V54.1899C49.4244 54.5366 49.3069 54.8271 49.0719 55.0612C48.8378 55.2961 48.5474 55.4136 48.2007 55.4136H31.0689ZM32.2926 52.9662H46.977V51.9873C46.977 51.7629 46.9211 51.559 46.8093 51.3754C46.6967 51.1919 46.5487 51.0491 46.3651 50.9471C45.2638 50.3965 44.1523 49.9833 43.0305 49.7075C41.9088 49.4326 40.7769 49.2951 39.6348 49.2951C38.4927 49.2951 37.3607 49.4326 36.239 49.7075C35.1173 49.9833 34.0058 50.3965 32.9045 50.9471C32.7209 51.0491 32.5732 51.1919 32.4615 51.3754C32.3489 51.559 32.2926 51.7629 32.2926 51.9873V52.9662ZM39.6348 43.1766C40.3078 43.1766 40.8842 42.9368 41.3639 42.4571C41.8427 41.9782 42.0822 41.4023 42.0822 40.7293C42.0822 40.0562 41.8427 39.4803 41.3639 39.0014C40.8842 38.5217 40.3078 38.2819 39.6348 38.2819C38.9617 38.2819 38.3858 38.5217 37.9069 39.0014C37.4272 39.4803 37.1874 40.0562 37.1874 40.7293C37.1874 41.4023 37.4272 41.9782 37.9069 42.4571C38.3858 42.9368 38.9617 43.1766 39.6348 43.1766Z" fill="#5992A6"/>
                </g>
                <circle cx="18.2758" cy="10.319" r="6.34097" fill="#FFBD14"/>
                <path d="M52.8126 21.4026C52.6855 21.0928 52.3863 20.8907 52.0544 20.8907H48.5792C47.5677 11.0918 40.3216 2.94011 30.7177 0.920631C30.3088 0.835308 29.9013 1.0726 29.771 1.47353L28.7387 4.6475C28.5859 5.11704 28.8874 5.63042 29.3673 5.72111C36.8711 7.14023 42.6184 13.3121 43.6217 20.8907H39.6758C38.9604 20.8907 38.5892 21.7944 39.0955 22.3061L45.2848 28.5589C45.601 28.8782 46.1292 28.8782 46.4453 28.5589L52.6347 22.3061C52.8693 22.0689 52.9396 21.7124 52.8126 21.4026Z" fill="#00AB71"/>
                <path d="M24.0892 39.9448C16.5854 38.5257 10.8381 32.3538 9.83482 24.7751H13.7808C14.4961 24.7751 14.8674 23.8714 14.361 23.3598L8.17174 17.107C7.85138 16.7833 7.33178 16.7833 7.01131 17.107L0.821816 23.3597C0.315591 23.8712 0.686707 24.775 1.40208 24.775H4.87724C5.88877 34.574 13.1348 42.7257 22.7387 44.7451C23.1427 44.8297 23.5568 44.5882 23.6856 44.1922L24.7178 41.0183C24.8706 40.5488 24.5691 40.0355 24.0892 39.9448Z" fill="#FE541F"/>
              </svg>

            </div>
            <div class="flex justify-end pt-2">
              <span class="font-light text-sm rounded-md bg-green-200 text-green-600 border border-green-600 p-2 tracking-wider">+13000</span>
            </div>
          </div>
          <div class="bg-white border border-gray-200 shadow rounded-md px-4 py-6 flex flex-col justify-center">
            <div class="flex-1 flex justify-between items-start">
              <div class="flex flex-col space-y-2">
                <span class="font-semibold text-2xl">4040</span>
                <span class="uppercase text-sm font-medium">Closed Loans</span>
              </div>

              <svg class="w-10" width="63" height="65" viewBox="0 0 63 65" fill="none" xmlns="http://www.w3.org/2000/svg">
                <mask id="mask0_89_1113" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="32" y="34" width="31" height="31">
                  <rect x="32.3447" y="34.4333" width="29.7147" height="29.7147" fill="#C4C4C4"/>
                </mask>
                <g mask="url(#mask0_89_1113)">
                  <path d="M55.8689 59.1954V55.4811H52.1546V53.0049H55.8689V49.2905H58.3452V53.0049H62.0595V55.4811H58.3452V59.1954H55.8689ZM47.2022 61.6717C45.4894 61.6717 43.8799 61.3465 42.3735 60.696C40.8672 60.0464 39.5568 59.1645 38.4425 58.0502C37.3282 56.9359 36.4463 55.6255 35.7967 54.1192C35.1463 52.6128 34.821 51.0033 34.821 49.2905C34.821 47.5778 35.1463 45.9683 35.7967 44.4619C36.4463 42.9555 37.3282 41.6452 38.4425 40.5309C39.5568 39.4166 40.8672 38.5342 42.3735 37.8838C43.8799 37.2342 45.4894 36.9094 47.2022 36.9094C48.5435 36.9094 49.8125 37.1055 51.0094 37.4975C52.2062 37.8896 53.3102 38.4364 54.3213 39.138L52.526 40.9642C51.7419 40.469 50.9062 40.0819 50.0189 39.8029C49.1316 39.5247 48.1927 39.3856 47.2022 39.3856C44.4577 39.3856 42.121 40.3501 40.192 42.2791C38.2622 44.2089 37.2973 46.5461 37.2973 49.2905C37.2973 52.035 38.2622 54.3722 40.192 56.302C42.121 58.2309 44.4577 59.1954 47.2022 59.1954C47.8625 59.1954 48.5022 59.1335 49.1212 59.0097C49.7403 58.8859 50.3387 58.7105 50.9165 58.4835L52.7737 60.3716C51.9276 60.7844 51.0403 61.1042 50.1117 61.3312C49.1831 61.5582 48.2133 61.6717 47.2022 61.6717ZM45.4688 54.9859L40.2068 49.7239L41.9402 47.9905L45.4688 51.5191L57.8499 39.1071L59.5833 40.8404L45.4688 54.9859Z" fill="#5992A6"/>
                </g>
                <circle cx="20.86" cy="10.9494" r="7.18155" fill="#FFBD14"/>
                <path d="M59.9752 23.5023C59.8313 23.1515 59.4924 22.9227 59.1166 22.9227H55.1807C54.0351 11.8248 45.8285 2.59244 34.9515 0.30525C34.4883 0.208617 34.0267 0.477368 33.8792 0.931441L32.7101 4.52617C32.537 5.05794 32.8785 5.63938 33.4219 5.74209C41.9205 7.34934 48.4297 14.3393 49.5659 22.9227H45.097C44.2868 22.9227 43.8664 23.9461 44.4398 24.5256L51.4496 31.6073C51.8077 31.969 52.4059 31.969 52.7639 31.6073L59.7737 24.5256C60.0395 24.257 60.1191 23.8532 59.9752 23.5023Z" fill="#00AB71"/>
                <path d="M27.4441 44.5022C18.9456 42.8951 12.4364 35.905 11.3001 27.3216H15.7692C16.5794 27.3216 16.9998 26.2981 16.4263 25.7187L9.41658 18.637C9.05375 18.2704 8.46527 18.2704 8.10232 18.637L1.09233 25.7186C0.518996 26.2979 0.939309 27.3215 1.74952 27.3215H5.68535C6.83098 38.4194 15.0376 47.6517 25.9146 49.9389C26.3722 50.0347 26.8412 49.7612 26.987 49.3127L28.156 45.718C28.329 45.1863 27.9876 44.6049 27.4441 44.5022Z" fill="#FE541F"/>
              </svg>
            </div>
            <div class="flex justify-end pt-2">
              <span class="font-light text-sm rounded-md bg-green-200 text-green-600 border border-green-600 p-2 tracking-wider">+3</span>
            </div>
          </div>
          <div class="bg-white border border-gray-200 shadow rounded-md px-4 py-6 flex flex-col justify-center">
            <div class="flex-1 flex justify-between items-start">
              <div class="flex flex-col space-y-2">
                <span class="font-semibold text-2xl">43521</span>
                <span class="uppercase text-sm font-medium">Total Members</span>
              </div>
              <svg class="w-10" width="58" height="61" viewBox="0 0 58 61" fill="none" xmlns="http://www.w3.org/2000/svg">
                <mask id="mask0_89_1159" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="28" y="30" width="30" height="31">
                  <rect x="28.6216" y="30.9395" width="29.3687" height="29.3687" fill="#D9D9D9"/>
                </mask>
                <g mask="url(#mask0_89_1159)">
                  <mask id="mask1_89_1159" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="31" y="31" width="27" height="28">
                    <rect x="31.2847" y="31.2937" width="26.7153" height="26.7153" fill="#D9D9D9"/>
                  </mask>
                  <g mask="url(#mask1_89_1159)">
                    <path d="M44.6424 41.3118C44.327 41.3118 44.0628 41.205 43.8498 40.9913C43.6361 40.7783 43.5292 40.5141 43.5292 40.1987V37.9724H41.3029C40.9875 37.9724 40.7234 37.8659 40.5104 37.653C40.2967 37.4392 40.1898 37.1747 40.1898 36.8593C40.1898 36.5439 40.2967 36.2793 40.5104 36.0656C40.7234 35.8526 40.9875 35.7462 41.3029 35.7462H43.5292V33.5199C43.5292 33.2045 43.6361 32.9399 43.8498 32.7262C44.0628 32.5132 44.327 32.4067 44.6424 32.4067C44.9577 32.4067 45.2223 32.5132 45.436 32.7262C45.649 32.9399 45.7555 33.2045 45.7555 33.5199V35.7462H47.9818C48.2972 35.7462 48.5617 35.8526 48.7754 36.0656C48.9884 36.2793 49.0949 36.5439 49.0949 36.8593C49.0949 37.1747 48.9884 37.4392 48.7754 37.653C48.5617 37.8659 48.2972 37.9724 47.9818 37.9724H45.7555V40.1987C45.7555 40.5141 45.649 40.7783 45.436 40.9913C45.2223 41.205 44.9577 41.3118 44.6424 41.3118ZM39.0767 55.7827C38.4644 55.7827 37.9405 55.5648 37.5049 55.1292C37.0686 54.6929 36.8504 54.1686 36.8504 53.5564C36.8504 52.9441 37.0686 52.4199 37.5049 51.9835C37.9405 51.5479 38.4644 51.3301 39.0767 51.3301C39.6889 51.3301 40.2128 51.5479 40.6484 51.9835C41.0848 52.4199 41.3029 52.9441 41.3029 53.5564C41.3029 54.1686 41.0848 54.6929 40.6484 55.1292C40.2128 55.5648 39.6889 55.7827 39.0767 55.7827ZM50.208 55.7827C49.5958 55.7827 49.0719 55.5648 48.6363 55.1292C48.1999 54.6929 47.9818 54.1686 47.9818 53.5564C47.9818 52.9441 48.1999 52.4199 48.6363 51.9835C49.0719 51.5479 49.5958 51.3301 50.208 51.3301C50.8203 51.3301 51.3446 51.5479 51.7809 51.9835C52.2165 52.4199 52.4343 52.9441 52.4343 53.5564C52.4343 54.1686 52.2165 54.6929 51.7809 55.1292C51.3446 55.5648 50.8203 55.7827 50.208 55.7827ZM39.0767 50.217C38.2233 50.217 37.5787 49.8504 37.1431 49.1172C36.7068 48.3847 36.702 47.6567 37.1287 46.9332L38.6314 44.206L34.6241 35.7462H33.511C33.1956 35.7462 32.9314 35.6393 32.7184 35.4256C32.5047 35.2126 32.3978 34.9484 32.3978 34.633C32.3978 34.3176 32.5047 34.0531 32.7184 33.8393C32.9314 33.6264 33.1956 33.5199 33.511 33.5199H35.3476C35.5517 33.5199 35.7465 33.5755 35.932 33.6868C36.1176 33.7982 36.2567 33.9559 36.3495 34.1599L40.7742 43.5381H48.594L52.6013 36.3027C52.6941 36.1358 52.8239 36.0011 52.9909 35.8987C53.1579 35.797 53.3434 35.7462 53.5475 35.7462C53.9742 35.7462 54.2944 35.9269 54.5081 36.2883C54.7211 36.6504 54.7255 37.017 54.5215 37.388L50.542 44.5956C50.3379 44.9667 50.0641 45.2542 49.7205 45.4583C49.3776 45.6624 49.0021 45.7644 48.594 45.7644H40.3011L39.0767 47.9907H51.3212C51.6366 47.9907 51.9008 48.0972 52.1137 48.3102C52.3275 48.5239 52.4343 48.7884 52.4343 49.1038C52.4343 49.4192 52.3275 49.6834 52.1137 49.8964C51.9008 50.1101 51.6366 50.217 51.3212 50.217H39.0767Z" fill="#5992A6"/>
                  </g>
                </g>
                <circle cx="18.2758" cy="10.3188" r="6.34097" fill="#FFBD14"/>
                <path d="M52.8126 21.4023C52.6855 21.0925 52.3863 20.8905 52.0544 20.8905H48.5792C47.5677 11.0916 40.3216 2.93987 30.7177 0.920387C30.3088 0.835064 29.9013 1.07236 29.771 1.47328L28.7387 4.64726C28.5859 5.11679 28.8874 5.63018 29.3673 5.72086C36.8711 7.13999 42.6184 13.3118 43.6217 20.8905H39.6758C38.9604 20.8905 38.5892 21.7942 39.0955 22.3058L45.2848 28.5586C45.601 28.878 46.1292 28.878 46.4453 28.5586L52.6347 22.3058C52.8693 22.0686 52.9396 21.7122 52.8126 21.4023Z" fill="#00AB71"/>
                <path d="M24.0892 39.9445C16.5854 38.5255 10.8381 32.3536 9.83482 24.7749H13.7808C14.4961 24.7749 14.8674 23.8712 14.361 23.3596L8.17174 17.1068C7.85138 16.7831 7.33178 16.7831 7.01131 17.1068L0.821816 23.3595C0.315591 23.871 0.686707 24.7748 1.40208 24.7748H4.87724C5.88877 34.5737 13.1348 42.7254 22.7387 44.7449C23.1427 44.8295 23.5568 44.588 23.6856 44.192L24.7178 41.018C24.8706 40.5486 24.5691 40.0352 24.0892 39.9445Z" fill="#FE541F"/>
              </svg>
            </div>
            <div class="flex justify-end pt-2">
              <span class="font-light text-sm rounded-md bg-green-200 text-green-600 border border-green-600 p-2 tracking-wider">+3</span>
            </div>
          </div>
        </div>
        <div class="rounded-md border border-gray-200 overflow-hidden shadow-lg bg-gradient-to-r from-eg-bg to-eg-text grid grid-cols-2 gap-0">
          <div class="flex-1 p-4 space-y-2">
            <h6 class="text-white text-sm pb-2">Latest Requests</h6>
            <div v-for="(request , i) in loanRequests.slice(0,4)" :key="i" class="space-y-1 py-2 border-b border-gray-50 text-gray-50">
              <p class="uppercase text-sm">{{ request.memberFirstName }} {{ request.memberLastName }}</p>
              <p class="text-sm">Requested KES {{ request.loanAmount }} <span class="font-semibold">{{ request.loanProductName }}</span></p>
            </div>
          </div>
          <div class="flex-1 flex flex-col justify-center items-center bg-white rounded-md space-y-4 py-4">
            <svg ref="targetD3" width="400" height="150"></svg>
            <svg ref="targetD30" width="400" height="150"></svg>
          </div>
        </div>
        <div class="rounded-md border border-gray-200 overflow-hidden shadow-lg bg-white grid grid-cols-2 gap-0">
          <h6 class="text-white px-5 pt-4 text-sm pb-2 text-eg-text">Loan Status</h6>
        </div>
        <div class="rounded-md border border-gray-200 shadow-lg bg-gradient-to-r from-eg-bg to-eg-text h-64">
          <h6 class="text-white px-5 pt-4 text-sm pb-2">Pending Approval</h6>
          <div class="rounded-md border border-gray-200 overflow-hidden shadow-lg bg-eg-text bg-opacity-90 w-full h-72 py-2 ml-5 scrollCustom overflow-y-scroll">
            <div v-for="(request , i) in loanRequests" :key="i" class="space-y-1 py-1 text-gray-50 px-3 flex items-center justify-center">
              <div class="flex-1">
                <p class="text-sm text-white font-thin">
                  Request NO
                  <span class="uppercase">10230120 </span>
                  <span class="uppercase font-normal">{{ request.memberFirstName }} {{ request.memberLastName }}</span>
                  requested guarantorship of KES <span class="font-normal">{{ request.loanAmount }} {{ request.loanProductName }}</span>
                </p>
              </div>
              <div class="flex-1 flex items-center px-6 relative">
                <div class="w-full border border-white h-2 rounded-full flex">
                  <div :style="{ width: hrWidth(i) + '%' }" class="bg-white"></div>
                </div>

                <div class="w-4 bg-white h-4 left-1/4 rounded-full absolute"></div>
                <span class="left-1/4 rounded-full mt-10 -ml-5 text-xxs absolute">Accepted</span>
                <div class="w-4 bg-white h-4 left-1/2 rounded-full absolute"></div>
                <span class="left-1/2 rounded-full mt-10 -ml-2 text-xxs absolute">Signed</span>
                <div class="w-4 bg-white h-4 right-1/4 rounded-full absolute"></div>
                <span class="right-1/4 rounded-full mt-10 -mr-5 text-xxs absolute">Approved</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
