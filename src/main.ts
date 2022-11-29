import { createApp } from 'vue';
import App from './App.vue';
import router from './router/';
import { pinia } from './stores/';
import { useMainStore } from "./stores/main-store";
import './index.css';

const app = createApp(App);

app.use(router);
app.use(pinia);

const mainStore = useMainStore(pinia);

const spinner: any = document.getElementById("spinner");

if (spinner) {
    spinner.style.display = "block";
}

router.beforeEach((to) => {
    if (to.meta.requiresAuth) {
        mainStore.initialize()
        .then((data: any) => {
            mainStore.setAuthState(data);
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
        .then(() => mainStore.fetchLoanProducts())
        .catch((e: any) => {
            console.log(JSON.stringify(e))
        });
    } else {
        const currentUrl = window.location.href;
        window.location.href = `${import.meta.env.VITE_APP_AUTH}?redirect_url=${currentUrl}`;
    }
});

app.mount('#app');
