<script setup lang="ts">
  import Breadcrumb from "../../components/Breadcrumb.vue";
  import MembersTable from "../../components/MembersTable.vue";
  import {computed, ComputedRef, onMounted, reactive, ref} from "vue";
  import {
    UserPlusIcon,
    ArrowUpTrayIcon,
    ChevronDownIcon,
  } from '@heroicons/vue/20/solid'
  import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
  import GlobalSearch from "../../components/GlobalSearch.vue";
  import DropDown from "../../components/DropDown.vue";
  import stores from "../../stores";
  import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue';
  import Paginator from "../../components/Paginator.vue";
  import {helpers, required} from "@vuelidate/validators";
  import useVuelidate from "@vuelidate/core";
  import {useRouter} from "vue-router";
  import parsePhoneNumber, {isValidNumberForRegion} from "libphonenumber-js";
  const { memberStore, authStore } = stores;
  const router = useRouter();

  const filters = reactive({
    recordsPerPage: 10,
    searchTerm: '',
    page: 1
  })

  const queryMembers: ComputedRef<string> = computed(() => {
    return (`?pageSize=${filters.recordsPerPage}&pageIndex=${filters.page - 1}`)
  })

  const searchMembers = (customFilters?: {searchTerm?: string}) => {
    if (customFilters) {
      const { searchTerm } = customFilters
      if (searchTerm) {
        memberStore.fetchMembers(`${queryMembers.value}&searchTerm=${searchTerm}`)
      } else {
        memberStore.fetchMembers(queryMembers.value)
      }
    } else {
      memberStore.fetchMembers(queryMembers.value)
    }
  }

  const refreshNext = (cP: number) => {
    filters.page = cP + 1;
    searchMembers();
  }
  const refreshPrev = (cP: number) => {
    filters.page = cP - 1;
    searchMembers();
  }
  const refreshCurrent = () => {
    searchMembers();
  }
  const actions = [
    {
      id: 1,
      name: 'Create Member',
      icon: UserPlusIcon,
      href: '/members/create'
    },
    {
      id: 2,
      name: 'Import Members',
      icon: ArrowUpTrayIcon,
      href: '/members/import'
    }
  ]

  onMounted(async () => {
    await Promise.all([
      memberStore.fetchMembersSummary(),
      memberStore.fetchMembers(queryMembers.value),
    ])
  })

  const exportMembers = async (all?: any) => {
    if (all === 'all') {
      if (confirm("You are about to export all member data. Proceed?")) {
        const maxValue = 2147483647;
        const url = await memberStore.exportMembers(`?pageSize=${maxValue}`);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', new Date() + 'all-members.csv');
        document.body.appendChild(link);
        link.click();
      }
    } else {
      const url = await memberStore.exportMembers(queryMembers.value)
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', new Date() + 'filtered-members.csv');
      document.body.appendChild(link);
      link.click();
    }
  }

  const openPullMemberModal = ref(false)

  // /core-banking/member-details?memberIdentifier=ss&identifierType=EMAIL&force=false

  const pullForm = reactive({
    memberIdentifier: null,
    identifierType: null,
    force: false
  })

  const validPhone = (value: number) => (pullForm.identifierType && pullForm.identifierType === 'PHONE_NUMBER') ? isValidNumberForRegion(`${value}`, 'KE') : true;

  const pullFormRules = {
    memberIdentifier: {
      required,
      validPhone: helpers.withMessage('Please provide a phone number',
          validPhone
      )
    },
    identifierType: {
      required,
    },
    force: {
      required,
    },
  }

  const v$ = useVuelidate(pullFormRules, pullForm, { $lazy: true, $autoDirty: true})

  const identifierTypes = ref([
    {
      id: 1,
      name: 'Email',
      value: 'EMAIL'
    },
    {
      id: 2,
      name: 'ID Number',
      value: 'ID_NUMBER'
    },
    {
      id: 3,
      name: 'Phone Number',
      value: 'PHONE_NUMBER'
    },
    {
      id: 4,
      name: 'Member Number',
      value: 'MEMBER_NUMBER'
    }
  ])

  const pullMember = async () => {
    const result = await v$.value.$validate()

    if (result) {
      const phoneNumber = (pullForm.identifierType && pullForm.identifierType === 'PHONE_NUMBER') ? parsePhoneNumber(`${pullForm.memberIdentifier}`, 'KE') : null

      const [submitted] = await Promise.allSettled([
        memberStore.getCo_bankingMemberDetails(`?memberIdentifier=${ phoneNumber ? `${phoneNumber?.countryCallingCode}${phoneNumber?.nationalNumber}` : pullForm.memberIdentifier}&identifierType=${pullForm.identifierType}&force=${pullForm.force}`)
      ])

      if (submitted.status === 'fulfilled') {
        authStore.defineNotification({
          id: (Math.random().toString(36) + Date.now().toString(36)).substring(2),
          message: 'Member pulled successfully!',
          success: true
        })

        openPullMemberModal.value = false

        if (submitted.value) {
          await router.push({name: 'MemberView', params: { refId: submitted.value.refId }})
        }
      } else {
        authStore.defineNotification({
          id: (Math.random().toString(36) + Date.now().toString(36)).substring(2),
          message: 'Member pull error!',
          error: true
        })

        openPullMemberModal.value = false
      }
    }
  }

  const openMemberTransferModal = ref<boolean>(false)

  const memberTransferForm = reactive({
    joinDate: null,
    endDate: null
  })

  const memberTransferFormRules = {
    joinDate: {
      required,
    },
    endDate: {
      required,
    },
  }

  const v1$ = useVuelidate(memberTransferFormRules, memberTransferForm, { $lazy: true, $autoDirty: true})

  const initMemberTransfer = async () => {
    const result = await v1$.value.$validate()

    if (result && confirm("You ae about to initiate member transfers. Proceed?") && memberTransferForm.joinDate && memberTransferForm.endDate) {
      const urlParams = new URLSearchParams();
      urlParams.set("joinDate", memberTransferForm.joinDate);
      urlParams.set("endDate", memberTransferForm.endDate);

      const [submitted] = await Promise.allSettled([
        memberStore.initMemberTransfers(urlParams.toString())
      ])

      if (submitted.status === 'fulfilled') {
        authStore.defineNotification({
          id: (Math.random().toString(36) + Date.now().toString(36)).substring(2),
          message: 'Member transfers initiated successfully!',
          success: true
        })

        openMemberTransferModal.value = false

        console.log(submitted.value)

      } else {
        authStore.defineNotification({
          id: (Math.random().toString(36) + Date.now().toString(36)).substring(2),
          message: 'Member transfers failed to initiated!',
          error: true
        })

        openMemberTransferModal.value = false
      }

    }
  }

</script>
<template>
  <div class="flex flex-1 flex-col">
    <main class="flex-1">
      <div class="pt-2 pb-16">
        <div class="mx-auto space-y-6 sm:px-6 lg:px-5">
          <div class="flex justify-between items-center">
            <Breadcrumb pageName="" linkName="All Members" linkUrl="/members"  current="Members"/>
            <div class="flex space-x-2">
              <button @click="openMemberTransferModal = true" type="button" class="inline-flex w-32 justify-center rounded-md border border-gray-300 bg-white px-2 py-1 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-eg-bg focus:ring-offset-2 focus:ring-offset-gray-100">
                Init Transfers
              </button>
              <button @click="openPullMemberModal = true" type="button" class="inline-flex w-32 justify-center rounded-md border border-gray-300 bg-white px-2 py-1 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-eg-bg focus:ring-offset-2 focus:ring-offset-gray-100">
                Pull Member
              </button>
              <DropDown :items="actions">
                <MenuButton class="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-2 py-1 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-eg-bg focus:ring-offset-2 focus:ring-offset-gray-100">
                  Actions
                  <ChevronDownIcon class="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
                </MenuButton>
              </DropDown>
            </div>
          </div>
          <div class="sm:grid sm:grid-cols-4 sm:gap-2">
            <div class="rounded-md shadow bg-white flex flex-col px-4 py-6">
              <div class="flex-1 flex justify-between items-start">
                <div class="flex flex-col space-y-2">
                  <span class="uppercase text-sm font-medium">Total Members</span>
                  <span class="font-semibold text-lg">{{ memberStore.getMemberSummary ? (memberStore.getMemberSummary?.ACTIVE +  memberStore.getMemberSummary?.DORMANT + memberStore.getMemberSummary?.EXITED) : 0 }}</span>
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
            </div>
            <div class="rounded-md shadow bg-white flex flex-col px-4 py-6">
              <div class="flex-1 flex justify-between items-start">
                <div class="flex flex-col space-y-2">
                  <span class="uppercase text-sm font-medium">Active Members</span>
                  <span class="font-semibold text-lg">{{ memberStore.getMemberSummary?.ACTIVE }}</span>
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
            </div>
            <div class="rounded-md shadow bg-white flex flex-col px-4 py-6">
              <div class="flex-1 flex justify-between items-start">
                <div class="flex flex-col space-y-2">
                  <span class="uppercase text-sm font-medium">Dormant Members</span>
                  <span class="font-semibold text-lg">{{ memberStore.getMemberSummary?.DORMANT }}</span>
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
            </div>
            <div class="rounded-md shadow bg-white flex flex-col px-4 py-6">
              <div class="flex-1 flex justify-between items-start">
                <div class="flex flex-col space-y-2">
                  <span class="uppercase text-sm font-medium">Exited Members</span>
                  <span class="font-semibold text-lg">{{ memberStore.getMemberSummary?.EXITED }}</span>
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
            </div>
          </div>
          <MembersTable :members="memberStore.getMembers">
            <div class="sm:flex-auto">
              <GlobalSearch :placeholder="'Search Members'" :ctx="$route.name" @update="searchMembers" />
            </div>
            <div class="mt-0 ml-16 flex flex-wrap space-x-4">
              <Menu as="div" class="relative inline-block text-left">
                <div>
                  <MenuButton type="button" class="inline-flex items-center justify-center rounded-md border border-transparent bg-eg-bg px-4 py-2 text-sm font-medium text-white shadow-sm hover:opacity-75 focus:outline-none focus:ring-2 focus:ring-eg-bg focus:ring-offset-2 sm:w-auto">
                    <span class="sr-only">export requests options</span>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                    </svg>
                    Export Members
                  </MenuButton>
                </div>

                <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
                  <MenuItems class="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div class="py-1">
                      <form @submit.prevent="exportMembers('all')">
                        <MenuItem v-slot="{ active }">
                          <button type="submit" :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block w-full px-4 py-2 text-left text-sm']">Export All</button>
                        </MenuItem>
                      </form>
                      <form @submit.prevent="exportMembers">
                        <MenuItem v-slot="{ active }">
                          <button type="submit" :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block w-full px-4 py-2 text-left text-sm']">Export Filtered</button>
                        </MenuItem>
                      </form>
                    </div>
                  </MenuItems>
                </transition>
              </Menu>
            </div>
          </MembersTable>
          <Paginator
              :current-page="filters.page"
              :filter-form="filters"
              @refreshNext="refreshNext"
              @refreshPrev="refreshPrev"
              @refreshCurrent="refreshCurrent"
              :total-pages="memberStore.getPaginationData ? memberStore.getPaginationData.totalPages : 0"
              :total-elements="memberStore.getPaginationData ? memberStore.getPaginationData.totalElements : 0"
          />
        </div>
      </div>
    </main>

    <TransitionRoot as="template" :show="openPullMemberModal">
      <Dialog as="div" class="relative z-10" @close="openPullMemberModal = false">
        <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </TransitionChild>

        <div class="fixed inset-0 z-10 overflow-y-auto">
          <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leave-from="opacity-100 translate-y-0 sm:scale-100" leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
              <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">Pull Member</DialogTitle>
                <div class="mt-4">
                  <form @submit.prevent="pullMember" class="space-y-6">
                    <div>
                      <div class="grid grid-cols-6 gap-6">
                        <div class="col-span-6">
                          <label for="template-name" class="block text-sm font-medium text-gray-700">Template Name</label>
                          <select v-model="pullForm.identifierType" id="template-name" class="mt-2 appearance-none text-slate-900 bg-white rounded-md block w-full px-3 h-10 shadow-sm sm:text-sm focus:border-transparent focus:outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-eg-bg ring-1 ring-slate-200">
                            <option :value="null">-Select Identifier Type-</option>
                            <option v-for="(option, i) in identifierTypes" :key="`${option.id}${i}`" :value="option.value">{{ option.name }}</option>
                          </select>
                          <div class="input-errors" v-for="(error, index) of v$.identifierType.$errors" :key="index">
                            <div class="text-xs text-red-400">{{ error.$message }}</div>
                          </div>
                        </div>
                        <div class="col-span-6">
                          <label for="name" class="block text-sm font-medium text-gray-700">Member Identifier</label>
                          <input v-model="pullForm.memberIdentifier" id="name" type="text" class="mt-2 appearance-none text-slate-900 bg-white rounded-md block w-full px-3 h-10 shadow-sm sm:text-sm focus:border-transparent focus:outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-eg-bg ring-1 ring-slate-200" />
                          <div class="input-errors" v-for="(error, index) of v$.memberIdentifier.$errors" :key="index">
                            <div class="text-xs text-red-400">{{ error.$message }}</div>
                          </div>
                        </div>
                        <div class="col-span-6">
                          <div class="flex items-center justify-between">
                            <div class="flex items-center">
                              <input v-model="pullForm.force" id="pull-cb" name="remember-me" type="checkbox" class="h-4 w-4 rounded border-gray-300 text-eg-bg focus:outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-eg-bg ring-1 ring-slate-200">
                              <label for="pull-cb" class="ml-2 block text-sm text-gray-900">Pull from co-banking</label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <button type="submit" class="flex w-full justify-center rounded-md border border-transparent bg-eg-bg py-2 px-4 text-sm font-medium text-white shadow-sm hover:opacity-75 focus:outline-none focus:ring-2 focus:ring-eg-bg focus:ring-offset-2">Submit</button>
                    </div>
                  </form>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <TransitionRoot as="template" :show="openMemberTransferModal">
      <Dialog as="div" class="relative z-10" @close="openMemberTransferModal = false">
        <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </TransitionChild>

        <div class="fixed inset-0 z-10 overflow-y-auto">
          <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leave-from="opacity-100 translate-y-0 sm:scale-100" leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
              <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">Initialize Member Transfers</DialogTitle>
                <div class="mt-4">
                  <form @submit.prevent="initMemberTransfer" class="space-y-6">

                    <div class="grid grid-cols-6 gap-6">

                      <div class="col-span-6">
                        <label for="joinDate" class="block text-sm font-medium text-gray-700">Join Date</label>
                        <input v-model="memberTransferForm.joinDate" id="joinDate" :max="new Date().toLocaleDateString('en-CA')" type="date" lang="en-GB" class="mt-2 appearance-none text-slate-900 bg-white rounded-md block w-full px-3 h-10 shadow-sm sm:text-sm focus:border-transparent focus:outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-eg-bg ring-1 ring-slate-200" />
                        <div class="input-errors" v-for="(error, index) of v1$.joinDate.$errors" :key="index">
                          <div class="text-xs text-red-400">{{ error.$message }}</div>
                        </div>
                      </div>

                      <div class="col-span-6">
                        <label for="endDate" class="block text-sm font-medium text-gray-700">End Date</label>
                        <input v-model="memberTransferForm.endDate" id="endDate" :max="new Date().toLocaleDateString('en-CA')" type="date" lang="en-GB" class="mt-2 appearance-none text-slate-900 bg-white rounded-md block w-full px-3 h-10 shadow-sm sm:text-sm focus:border-transparent focus:outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-eg-bg ring-1 ring-slate-200" />
                        <div class="input-errors" v-for="(error, index) of v1$.endDate.$errors" :key="index">
                          <div class="text-xs text-red-400">{{ error.$message }}</div>
                        </div>
                      </div>

                    </div>

                    <button type="submit" class="flex w-full justify-center rounded-md border border-transparent bg-eg-bg py-2 px-4 text-sm font-medium text-white shadow-sm hover:opacity-75 focus:outline-none focus:ring-2 focus:ring-eg-bg focus:ring-offset-2">Submit</button>

                  </form>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>
