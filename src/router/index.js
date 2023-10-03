import { createRouter, createWebHistory, createMemoryHistory } from 'vue-router';
const isClient = typeof window !== 'undefined';
// https://router.vuejs.org/guide/advanced/meta.html
const routes = [
    { path: '/', name: 'Home', redirect: '/loan-requests?pageSize=10&pageIndex=0&isActive=true' /*component: () => import("@/views/HomePage.vue"), meta: { requiresAuth: true }*/ },
    { path: '/dashboard', redirect: '/loan-requests?pageSize=10&pageIndex=0&isActive=true' /*name: 'Dashboard', component: () => import("@/views/HomePage.vue"), meta: { requiresAuth: true }*/ },
    { path: '/loan-requests', name: 'LoanRequests', component: () => import("@/views/loan-requests/index.vue"), meta: { requiresAuth: true } },
    { path: '/loan-requests/:refId/view', name: 'LoanRequestsView', component: () => import("@/views/loan-requests/_refId.vue"), meta: { requiresAuth: true } },
    { path: '/members', name: 'Members', component: () => import("@/views/members/index.vue"), meta: { requiresAuth: true } },
    { path: '/members/create', name: 'MembersCreate', component: () => import("@/views/members/create.vue"), meta: { requiresAuth: true } },
    { path: '/members/import', name: 'MembersImport', component: () => import("@/views/members/import.vue"), meta: { requiresAuth: true } },
    { path: '/members/import/upload', name: 'MembersImportUpload', component: () => import("@/views/members/ImportTable.vue"), meta: { requiresAuth: true } },
    { path: '/members/:refId/view', name: 'MemberView', component: () => import("@/views/members/_refId.vue"), meta: { requiresAuth: true } },
    { path: '/members/:refId/edit', name: 'MemberEdit', component: () => import("@/views/members/edit/_refId.vue"), meta: { requiresAuth: true } },
    { path: '/members/:type/type', name: 'MemberTypes', component: () => import("@/views/members/_type.vue"), meta: { requiresAuth: true } },
    { path: '/loans', name: 'Loans', component: () => import("@/views/loans/index.vue"), meta: { requiresAuth: true } },
    { path: '/loans/:id', name: 'Loan', component: () => import("@/views/loans/_id.vue"), meta: { requiresAuth: true } },
    { path: '/loans/:type/type', name: 'LoanTypes', component: () => import("@/views/loans/_type.vue"), meta: { requiresAuth: true } },
    { path: '/settings', name: 'Settings', redirect: '/settings/zoho-integration' /*component: () => import("@/views/settings/index.vue"), meta: { requiresAuth: true }*/ },
    { path: '/settings/:type', name: 'SettingsTypes', component: () => import("@/views/settings/_type.vue"), meta: { requiresAuth: true } },
    { path: '/settings/loan-products/create', name: 'CreateLoanProducts', component: () => import("@/views/settings/loan-product/create.vue"), meta: { requiresAuth: true } },
    { path: '/settings/loan-products/:refId/edit', name: 'EditLoanProducts', component: () => import("@/views/settings/loan-product/_refId.vue"), meta: { requiresAuth: true } },
];
const router = createRouter({
    history: isClient ? createWebHistory() : createMemoryHistory(),
    routes,
    scrollBehavior() {
        return { top: 0 };
    },
});
export default router;
//# sourceMappingURL=index.js.map