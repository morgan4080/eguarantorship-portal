import { createRouter, createWebHistory, createMemoryHistory } from 'vue-router'

const isClient = typeof window !== 'undefined'

// https://router.vuejs.org/guide/advanced/meta.html

const routes = [
    { path:'/', name: 'Home', component: () => import("@/views/HomePage.vue"), meta: { requiresAuth: false } }
]

const router = createRouter({
    history: isClient ?  createWebHistory() : createMemoryHistory(),
    routes
})

export default router
