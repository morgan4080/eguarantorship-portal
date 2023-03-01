<template>
  <div>
    <TransitionRoot as="template" :show="sidebarOpen">
      <Dialog as="div" class="relative z-40 lg:hidden" @close="sidebarOpen = false">
        <TransitionChild as="template" enter="transition-opacity ease-linear duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="transition-opacity ease-linear duration-300" leave-from="opacity-100" leave-to="opacity-0">
          <div class="fixed inset-0 bg-slate-600 bg-opacity-75" />
        </TransitionChild>

        <div class="fixed inset-0 z-40 flex">
          <TransitionChild as="template" enter="transition ease-in-out duration-300 transform" enter-from="-translate-x-full" enter-to="translate-x-0" leave="transition ease-in-out duration-300 transform" leave-from="translate-x-0" leave-to="-translate-x-full">
            <DialogPanel class="relative flex w-full max-w-xs flex-1 flex-col bg-white">
              <TransitionChild as="template" enter="ease-in-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in-out duration-300" leave-from="opacity-100" leave-to="opacity-0">
                <div class="absolute top-0 right-0 -mr-12 pt-2">
                  <button type="button" class="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" @click="sidebarOpen = false">
                    <span class="sr-only">Close sidebar</span>
                    <XMarkIcon class="h-6 w-6 text-white" aria-hidden="true" />
                  </button>
                </div>
              </TransitionChild>
              <div class="h-0 flex-1 overflow-y-auto pt-5 pb-4">
                <router-link to="/" class="flex flex-shrink-0 items-center px-4">
                  <TheLogo class="h-8 w-auto" />
                  <span class="text-eg-bg ml-4 mt-2 block font-semibold">{{ organisation }}</span>
                </router-link>
                <nav class="mt-5 space-y-1 px-2">
                  <a v-for="item in navigation" :key="item.name" :href="item.url" :class="[item.current ? 'bg-eg-bg text-white' : 'text-eg-bg hover:bg-slate-50 hover:text-slate-900', 'group flex items-center rounded-md px-2 py-2 text-base font-medium']">
                    <component :is="item.icon" :class="[item.current ? 'text-white' : 'text-slate-400 group-hover:text-slate-500', 'mr-4 h-6 w-6 flex-shrink-0']" aria-hidden="true" />
                    {{ item.name }}
                  </a>
                </nav>
              </div>
            </DialogPanel>
          </TransitionChild>
          <div class="w-14 flex-shrink-0">
            <!-- Force sidebar to shrink to fit close icon -->
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Static sidebar for desktop -->
    <div class="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-24 lg:flex-col">
      <!-- Sidebar component, swap this element with another sidebar if you like -->
      <div class="flex min-h-0 flex-1 flex-col border-r border-slate-200 bg-white">
        <div class="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
          <router-link to="/" class="flex items-center justify-center flex-shrink-0 items-center px-4">
            <TheLogo class="h-10 w-auto" />
          </router-link>
          <div class="mt-6 w-full flex-1 space-y-1 px-2" aria-label="Sidebar">
            <template v-for="item in navigation" :key="item.name">
              <RouterLink v-if="item.subMenus.length === 0" :to="item.url" :class="[item.current ? 'bg-eg-bg text-white' : 'text-eg-bg hover:bg-slate-50 hover:text-slate-900', 'group flex w-full flex-col items-center rounded-md p-3 text-sm font-medium']" :aria-current="item.current ? 'page' : undefined">
                <component :is="item.icon" :class="[item.current ? 'text-white' : 'text-slate-400 group-hover:text-slate-500', 'h-6 w-6']" aria-hidden="true" />
                <span class="mt-2">{{ item.name }}</span>
              </RouterLink>
              <Disclosure as="div" v-else class="space-y-1" v-slot="{ open }">
                <DisclosureButton :class="[item.current ? 'bg-gray-100 text-gray-900' : 'relative bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900', 'group flex w-full items-center rounded-md py-2 pr-2 text-left text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-500']">
                  <svg :class="[open ? 'rotate-90 text-eg-bg' : 'text-gray-300', 'right-0 absolute bottom-10 h-5 w-5 flex-shrink-0 transform transition-colors duration-150 ease-in-out group-hover:text-gray-400']" viewBox="0 0 20 20" aria-hidden="true">
                    <path d="M6 6L14 10L6 14V6Z" fill="currentColor" />
                  </svg>
                  <RouterLink :to="item.url" :class="[item.current ? 'bg-eg-bg text-white' : 'text-eg-bg hover:bg-slate-50 hover:text-slate-900', 'group flex w-full flex-col items-center rounded-md p-3 text-sm font-medium']" :aria-current="item.current ? 'page' : undefined">
                    <component :is="item.icon" :class="[item.current ? 'text-white' : 'text-slate-400 group-hover:text-slate-500', 'h-6 w-6']" aria-hidden="true" />
                    <span class="mt-2">{{ item.name }}</span>
                  </RouterLink>
                </DisclosureButton>
                <DisclosurePanel class="space-y-1">
                  <DisclosureButton v-for="subItem in item.subMenus" :key="subItem.title" as="a" :href="subItem.url" class="group flex w-full items-center rounded-md py-2 pr-2 text-sm text-center font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900">{{ subItem.title }}</DisclosureButton>
                </DisclosurePanel>
              </Disclosure>
            </template>
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-1 flex-col lg:pl-24">
      <div class="sticky top-0 z-10 bg-slate-100 pl-1 pt-1 sm:pl-3 sm:pt-3 lg:hidden">
        <button type="button" class="-ml-0.5 -mt-0.5 inline-flex h-12 w-12 items-center justify-center rounded-md text-slate-500 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-eg-bg" @click="sidebarOpen = true">
          <span class="sr-only">Open sidebar</span>
          <Bars3Icon class="h-6 w-6" aria-hidden="true" />
        </button>
      </div>
      <main class="flex-1">
        <TheNavBar />
        <div class="px-4 sm:px-0 py-16">
          <slot></slot>
        </div>
      </main>
    </div>

  </div>
</template>

<script setup lang="ts">
  import {computed, reactive, ref, VNodeProps, HTMLAttributes, UnwrapRef} from 'vue'
  import {
    Dialog,
    DialogPanel,
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    TransitionChild,
    TransitionRoot
  } from '@headlessui/vue'
  import {
    Bars3Icon,
    UsersIcon,
    XMarkIcon,
    RectangleGroupIcon,
    Cog6ToothIcon
  } from '@heroicons/vue/24/outline'
  import TheLogo from "./TheLogo.vue"
  import stores from "../stores"
  import TheNavBar from './TheNavBar.vue'

  type NavigationType = {name: string; url: string; icon: UnwrapRef<HTMLAttributes & VNodeProps>; current: boolean; expanded: boolean; subMenus: {title: string; url: string;}[]}[]
  const navigation = reactive(<NavigationType>[
    {
      name: 'Requests',
      url: '/loan-requests?pageSize=10&pageIndex=0&isActive=true',
      icon: RectangleGroupIcon,
      current: false,
      expanded: false,
      subMenus: []
    },
    {
      name: 'Members',
      url: '/members',
      icon: UsersIcon,
      current: false,
      expanded: false,
      subMenus: []
    },
    {
      name: 'Settings',
      url: '/settings',
      icon: Cog6ToothIcon,
      current: false,
      expanded: false,
      subMenus: [
        {
          title: 'Zoho Integration',
          url: '/settings/zoho-integration'
        },
        {
          title: 'Loan Products',
          url: '/settings/loan-products'
        },
        {
          title: 'Client Settings',
          url: '/settings/client-settings'
        }
      ]
    },
  ])

  const sidebarOpen = ref(false)
  const authStore = stores.authStore;
  const organisation = computed(() => authStore.getLoggedInUser ? authStore.getLoggedInUser.companyName : null)
  const user = computed(() => authStore.getLoggedInUser ? authStore.getLoggedInUser : null)
</script>