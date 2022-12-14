import { createApp, markRaw } from 'vue';
import App from './App.vue';
import router from './router/';
import { pinia } from './stores/';
import stores from "./stores";
import nProgress from "nprogress";
import "../node_modules/nprogress/nprogress.css";
import './index.css';

const app = createApp(App);
pinia.use(({ store }) => {
    store.router = markRaw(router);
});

app.use(router);

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

const { authStore } = stores;

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
                    response.text().then(async (text) => {
                        const err = new Error("HTTP status code: " + response.status);
                        err.message = text;
                        if (response.status === 401) {

                        }
                        if (response.status >= 500 && response.status < 600) {
                            const {message} = JSON.parse(text)
                            await authStore.defineNotification({
                                id: (Math.random().toString(36) + Date.now().toString(36)).substring(2),
                                message: `${message}`,
                                error: true
                            })
                        }
                        throw err;
                    });
                }
                console.log("fetch completed!", args, response.status);
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
            })
            .catch((e: any) => {
                console.log("Network error" ,e);
                const currentUrl = window.location.href;
                window.location.href = `${import.meta.env.VITE_APP_AUTH}?redirect_url=${currentUrl}`;
            })
            .catch((e: any) => {
                console.log(JSON.stringify(e))
            });
    } else {
        const currentUrl = window.location.href;
        window.location.href = `${import.meta.env.VITE_APP_AUTH}?redirect_url=${currentUrl}`;
    }
});

app.mount('#app');
