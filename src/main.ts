import { createApp } from 'vue';
import App from './App.vue';
import router from './router/';
import { pinia } from './stores/';
import { useMainStore } from "./stores/main-store";
import './index.css';

const app = createApp(App);

app.use(router);
app.use(pinia);

const spinner: any = document.getElementById("spinner");

if (spinner) {
    spinner.style.display = "block";
}

router.beforeEach((to) => {
    const mainStore = useMainStore(pinia)
    // initialize auth routine to determine if user is logged in or not
    mainStore.initialize().then(response => {
        mainStore.setAuthState(response);
        const loader: any = document.getElementById("loader")
        if (loader) {
            loader.style.display = "none"
        }
    }).catch((error: any) => {
        const currentUrl = window.location.href;
        window.location.href = `${import.meta.env.VITE_APP_ROOT_AUTH}?redirect_url=${currentUrl}`;
        return
    })
    // if the route loaded requires authentication redirect to login page
    if (to.meta.requiresAuth && !mainStore.isLoggedIn) {
        const currentUrl = window.location.href;
        window.location.href = `${import.meta.env.VITE_APP_ROOT_AUTH}?redirect_url=${currentUrl}`;
        return
    }
})
app.mount('#app')
