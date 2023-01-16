<script setup lang="ts">
import {computed, ref, watch} from "vue";
  import stores from "../stores";
  import TheLogo from "./TheLogo.vue";
  const accountMenu = ref(false);
  const authStore = stores.authStore;
  const organisation = computed(() => authStore.getLoggedInUser ? authStore.getLoggedInUser.companyName : null)
  const user = computed(() => authStore.getLoggedInUser ? authStore.getLoggedInUser : null)
  async function doLogout() {
    try {
      await fetch(`${import.meta.env.VITE_APP_AUTH}/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'multipart/form-data'
        },
      })
    } catch (e: any) {
      console.log(e.message)
    } finally {
      window.location.reload()
    }
  }

  const iamLocation = ref(import.meta.env.VITE_APP_IAM)

  const refDropDown = ref(<HTMLDivElement>(<unknown>null));

  const onClickAway = (ref: any, handler: any) => {
    const listener = (event: any) => {
      if (!ref || ref.contains(event.target)) {
        return;
      }
      handler(event);
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  };

  const onMouseDown = (e: any) => {
    if (accountMenu.value) e.preventDefault();
  };

  watch(accountMenu, () => {
    onClickAway(refDropDown.value, () => (accountMenu.value = false));
  });

</script>
<template>
  <nav class="bg-eg-bg drop-shadow z-10">
    <div class="mx-auto px-2 sm:px-6">
      <div class="relative flex items-center justify-between h-14">
        <div class="flex-shrink-0 flex items-center">
          <router-link to="/" class="navbar p-1 flex items-center justify-center" style="background: transparent;">
            <TheLogo class="h-12 w-auto" />
            <span class="text-white ml-4 mt-2 hidden sm:block font-semibold">{{ organisation }}</span>
          </router-link>
        </div>
        <div class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
          <!-- Profile dropdown -->
          <div class="ml-3 relative">
            <button @click="accountMenu = !accountMenu" @mousedown="onMouseDown($event)" type="button" class="flex flex-row items-center space-x-2 text-white px-3 py-2 rounded-md hover:text-gray-400 focus:outline-none">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span class="flex flex-col justify-start items-start">
                <span class="inline-flex items-center text-sm leading-4 font-medium" id="user-menu-button" aria-expanded="false" aria-haspopup="true">
                  <span class="sr-only">Open user menu</span>
                  {{ user ? user.firstName + ' ' + user.lastName : 'loading..' }}
                  <svg class="mt-1 rotate-90 flex-shrink-0 h-5 w-5 transform group-hover:text-gray-400 transition-colors ease-in-out duration-150 text-white" viewBox="0 0 20 20" aria-hidden="true" ><path d="M6 6L14 10L6 14V6Z" fill="currentColor"></path></svg>
                </span>
              </span>
            </button>

            <transition
                enter-active-class="transition ease-out duration-100"
                leave-active-class="transition ease-in duration-75"
                enter-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
            >
              <div ref="refDropDown" v-show="accountMenu" class="bg-gray-800 origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 focus:outline-none z-20" role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button" tabindex="-1">
                <a :href="iamLocation" target="_blank" rel="noopener noreferrer" class="navbar cursor-pointer block px-4 py-2 text-sm text-gray-100 hover:bg-gray-700" role="menuitem" tabindex="-1" id="user-menu-item-2">User Management</a>
                <a @click="doLogout" class="navbar cursor-pointer block px-4 py-2 text-sm text-gray-100 hover:bg-gray-700" role="menuitem" tabindex="-1" id="user-menu-item-2">Sign out</a>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>
