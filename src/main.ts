import { createApp } from 'vue';
import App from './App.vue';
import router from './router/';
import { pinia } from './stores/';
import stores from "./stores";
import './index.css';

const app = createApp(App);

app.use(router);

app.use(pinia);

const authStore = stores.authStore;

const spinner: any = document.getElementById("spinner");

if (spinner) {
    spinner.style.display = "block";
}

router.beforeEach((to) => {
    if (to.meta.requiresAuth) {
        authStore.initialize()
        .then((data: any) => {
            authStore.setAuthState(data);
            const loader: any = document.getElementById("loader");
            if (loader) {
                loader.style.display = "none";
            }
        })
        .catch((e: any) => {
            console.log("Network error" ,e);
            const currentUrl = window.location.href;
            window.location.href = `${import.meta.env.VITE_APP_AUTH}?redirect_url=${currentUrl}`;
        })
        .then(() => authStore.fetchLoanProducts())
        .catch((e: any) => {
            // console.log(JSON.stringify(e))
        });
    } else {
        const currentUrl = window.location.href;
        window.location.href = `${import.meta.env.VITE_APP_AUTH}?redirect_url=${currentUrl}`;
    }
});

app.mount('#app');
