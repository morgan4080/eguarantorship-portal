<script setup lang="ts">
import TheLogo from './TheLogo.vue';
import {computed, reactive, ref} from "vue";
import stores from "../stores";
import Icons from "./Icons.vue";
import { useRouter } from "vue-router";
const router = useRouter();
const authStore = stores.authStore;
const setWidth = ref(false);
const theUrl = import.meta.env.VITE_DOMAIN_URL;

const setWidthFn = () => {
  setWidth.value = !setWidth.value;
  menus.reduce((acc, currentValue) => {
    currentValue.expanded = false
    return acc
  })
}

const menus = reactive([
  /*{
    title: 'DASHBOARD',
    url: '/dashboard',
    icon: 'dashboard',
    expanded: false,
    subMenus: []
  },*/
  {
    title: 'REQUESTS',
    url: '/loan-requests?pageSize=10&pageIndex=0&isActive=true',
    icon: 'requests',
    expanded: false,
    subMenus: []
  },
  /*{
    title: 'LOANS',
    url: '/loans',
    icon: 'loans',
    expanded: false,
    subMenus: [
      {
        title: 'All Loans',
        url: '/loans/all-loans'
      },
      {
        title: 'Inua Loans',
        url: '/loans/inua-loans'
      },
      {
        title: 'FORSA Loans Advance',
        url: '/loans/forsa-loans'
      },
      {
        title: 'Sky Loans',
        url: '/loans/sky-loans'
      },
      {
        title: 'Borsa Loans',
        url: '/loans/borsa-loans'
      },
    ]
  },*/
  {
    title: 'MEMBERS',
    url: '/members',
    icon: 'members',
    expanded: false,
    subMenus: [
      /*{
        title: 'All Members',
        url: '/members/all-members/type'
      },
      {
        title: 'Active Members',
        url: '/members/active-members/type'
      },
      {
        title: 'Dormant Members',
        url: '/members/dormant-members/type'
      },*/
    ]
  },
  {
    title: 'SETTINGS',
    url: '/settings',
    icon: 'settings',
    expanded: false,
    subMenus: [
      {
        title: 'ZOHO INTEGRATION',
        url: '/settings/zoho-integration'
      },
      {
        title: 'LOAN PRODUCTS',
        url: '/settings/loan-products'
      },
      {
        title: 'CLIENT SETTINGS',
        url: '/settings/client-settings'
      },
      /*{
        title: 'Provider',
        url: '/settings/provider'
      },*/
    ]
  },
])

const navigateTo = (item: any) => {
  item.expanded = !item.expanded;

  if (item.subMenus.length === 0) {
    router.push(item.url)
  } else {
    setWidth.value = true
  }
}

</script>

<template>
  <div class="inset-y-0 flex flex-col transform ease-in-out transition-all transition duration-500 ease-in-out">
    <div class="flex min-h-0 flex-1 flex-col bg-white">
      <div class="relative">
        <button v-if="setWidth" @click="setWidthFn" type="button" class="absolute rounded px-1 border border-slate-200 transform rotate-90 -right-3 top-2 bg-white" style="background: white;">
          <svg class="rotate-90 opacity-75 flex-shrink-0 h-5 w-5 transform hover:text-slate-900 transition-colors ease-in-out duration-150 text-slate-500" viewBox="0 0 20 20" aria-hidden="true">
            <path d="M6 6L14 10L6 14V6Z" fill="currentColor"></path>
          </svg>
        </button>
        <button v-if="!setWidth" @click="setWidth = !setWidth;" type="button" class="absolute rounded px-1 border border-slate-200 transform -rotate-90 -right-3 top-2 bg-white" style="background: white;">
          <svg class="rotate-90 opacity-75 flex-shrink-0 h-5 w-5 transform hover:text-slate-900 transition-colors ease-in-out duration-150 text-slate-500" viewBox="0 0 20 20" aria-hidden="true">
            <path d="M6 6L14 10L6 14V6Z" fill="currentColor"></path>
          </svg>
        </button>
      </div>
      <div class="flex flex-col flex-grow border-r border-slate-200 mt-4 pb-4 overflow-y-auto overflow-x-hidden">
        <nav class="flex-1 px-4 space-y-1" aria-label="Sidebar">
          <div v-for="(item, i) in menus" :key="i">
            <router-link :to="item.url" @click="navigateTo(item)" type="button" :class="{'flex flex-col space-y-2' : !setWidth, 'flex space-x-6' : setWidth}" class="mt-1 hover:bg-slate-50 hover:text-slate-900 group w-full transform  items-center pl-2 pr-2 py-2 text-left text-xs font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-white" :aria-controls="`sub-menu-${i}`" :aria-expanded="item.expanded">
              <Icons :name="item.icon"/>
              <div class="flex items-end justify-center relative">
                <span class="text-xs font-medium">{{ item.title }}</span>

                <svg v-if="item.subMenus.length > 0" class="absolute -top-0.5 -right-5 h-5 w-5 transform group-hover:text-slate-400 transition-transform transition-colors ease-in-out duration-150" viewBox="0 0 20 20" aria-hidden="true" :class="{ 'text-slate-400 rotate-90': item.expanded, 'text-white': !(item.expanded) }">
                  <path d="M6 6L14 10L6 14V6Z" fill="currentColor"></path>
                </svg>
              </div>
            </router-link>
            <div v-if="item.subMenus.length > 0" :class="{'block' : item.expanded, 'hidden' : !item.expanded }" class="space-y-1 transform " id="sub-menu-2" >
              <router-link v-for="(sub, index) in item.subMenus" :key="index" :to="sub.url" class="group w-full flex items-center pl-18 pr-2 py-2 text-xs font-medium rounded-md hover:text-slate-900 hover:bg-slate-50">
                {{ sub.title }}
              </router-link>
            </div>
          </div>
        </nav>
      </div>
    </div>
  </div>
</template>
