import { createRouter, createWebHistory, createMemoryHistory } from 'vue-router'

const isClient = typeof window !== 'undefined'

// https://router.vuejs.org/guide/advanced/meta.html

const routes = [
    { path:'/', name: 'Home', component: () => import("@/views/HomePage.vue"), meta: { requiresAuth: true } },
    { path:'/dashboard', name: 'Dashboard', component: () => import("@/views/HomePage.vue"), meta: { requiresAuth: true } },
    { path:'/loan-requests', name: 'LoanRequests', component: () => import("@/views/loan-requests/index.vue"), meta: { requiresAuth: true } },
    { path:'/members', name: 'Members', component: () => import("@/views/members/index.vue"), meta: { requiresAuth: true } },
    { path:'/members/:id', name: 'Member', component: () => import("@/views/members/_id.vue"), meta: { requiresAuth: true } },
    { path:'/members/:type/type', name: 'MemberTypes', component: () => import("@/views/members/_type.vue"), meta: { requiresAuth: true } },
    { path:'/loans', name: 'Loans', component: () => import("@/views/loans/index.vue"), meta: { requiresAuth: true } },
    { path:'/loans/:id', name: 'Loan', component: () => import("@/views/loans/_id.vue"), meta: { requiresAuth: true } },
    { path:'/loans/:type/type', name: 'LoanTypes', component: () => import("@/views/loans/_type.vue"), meta: { requiresAuth: true } },
    { path:'/settings', name: 'Settings', component: () => import("@/views/settings/index.vue"), meta: { requiresAuth: true } },
    { path:'/settings/:type', name: 'SettingsTypes', component: () => import("@/views/settings/_type.vue"), meta: { requiresAuth: true } },
]

const router = createRouter({
    history: isClient ?  createWebHistory() : createMemoryHistory(),
    routes
})

export default router
