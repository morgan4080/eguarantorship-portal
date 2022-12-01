import { createApp, markRaw } from 'vue';
import App from './App.vue';
import router from './router/';
import { pinia } from './stores/';
import stores from "./stores";
import nProgress from "nprogress";
import "../node_modules/nprogress/nprogress.css";
import './index.css';

const app = createApp(App);

app.use(router);
pinia.use(({ store }) => {
    store.router = markRaw(router);
});
app.use(pinia);

app.config.globalProperties.$filters = {
    currencyKES: (money: number): string => {
        return `${parseFloat(`${money}`)
            .toFixed(0)
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}.${
            parseFloat(`${money}`).toFixed(2).split(".")[1]
        }`;
    },
};

const { authStore, loanProductStore } = stores;

const spinner: any = document.getElementById("spinner");

if (spinner) {
    spinner.style.display = "block";
}

window.fetch = new Proxy(window.fetch, {
    apply(fetch, that, args: any) {
        // Forward function call to the original fetch
        authStore.loading = true;
        nProgress.start();
        const result = fetch.apply(that, args);
        // Do whatever you want with the resulting Promise
        result
            .then(response => {
                if (!response.ok) {
                    response.text().then(text => {
                        const err = new Error("HTTP status code: " + response.status);
                        err.message = text;
                        if (response.status === 401) {

                        }
                        if (response.status >= 500 && response.status < 600) {

                        }
                        throw err;
                    });
                }
                console.log("fetch completed!", args, response);
            })
            .finally(() => {
                authStore.loading = false;
                nProgress.done();
            });

        return result;
    },
});

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
            .then(() => loanProductStore.fetchLoanProducts())
            .catch((e: any) => {
                console.log(JSON.stringify(e))
            });
    } else {
        const currentUrl = window.location.href;
        window.location.href = `${import.meta.env.VITE_APP_AUTH}?redirect_url=${currentUrl}`;
    }
});

app.mount('#app');
