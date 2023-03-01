<template>
  <Menu as="div" class="relative inline-block text-left">
    <div>
      <slot></slot>
    </div>

    <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
      <MenuItems class="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-slate-100 rounded-md bg-white shadow-lg  drop-shadow-2xl border border-slate-300 ring-1 ring-black ring-opacity-5 focus:outline-none">
        <div v-for="item in items" :key="item.id" class="py-1">
          <MenuItem v-slot="{ active }">
            <button v-if="item.button" @click="item.callback !== undefined ? item.callback(`${item.refId}`) : null" type="button" :class="[active ? 'bg-slate-100 text-slate-900' : 'text-slate-700', 'group flex items-center px-4 py-2 text-sm']">
              <component v-if="item.icon" :is="item.icon" class="mr-3 h-5 w-5 text-slate-400 group-hover:text-slate-500" />
              {{ item.name }}
            </button>
            <router-link v-else :to="`${item.href}`" :class="[active ? 'bg-slate-100 text-slate-900' : 'text-slate-700', 'group flex items-center px-4 py-2 text-sm']">
              <component v-if="item.icon" :is="item.icon" class="mr-3 h-5 w-5 text-slate-400 group-hover:text-slate-500" />
              {{ item.name }}
            </router-link>
          </MenuItem>
        </div>
      </MenuItems>
    </transition>
  </Menu>
</template>

<script setup lang="ts">
import { Menu, MenuItem, MenuItems } from '@headlessui/vue'
import {toRefs} from "vue";
const props = defineProps<{
  items: {id: number, name: string, icon?: any, href?: string, button?: boolean, callback?: (refId: string) => void, refId?: string}[]
}>()
const { items } = toRefs(props)
</script>