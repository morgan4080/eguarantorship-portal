<template>
  <Menu as="div" class="relative inline-block text-left">
    <div>
      <slot></slot>
    </div>

    <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
      <MenuItems class="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg  drop-shadow ring-1 ring-black ring-opacity-5 focus:outline-none">
        <div v-for="item in items" :key="item.id" class="py-1">
          <MenuItem v-slot="{ active }">
            <router-link :to="item.href" :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'group flex items-center px-4 py-2 text-sm']">
              <component v-if="item.icon" :is="item.icon" class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
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
  items: {id: number, name: string, icon?: any, href?: string}[]
}>()
const { items } = toRefs(props)
</script>