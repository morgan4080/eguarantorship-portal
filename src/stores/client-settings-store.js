import { defineStore } from "pinia";
export const useClientStore = defineStore('client-settings-store', {
    state: () => ({
        clientSettings: null
    }),
    getters: {
        getClientSettings(state) {
            return state.clientSettings;
        }
    },
    actions: {
        async fetchClientSettings() {
            try {
                const dat = await fetch(`${import.meta.env.VITE_API_URL}/clientSettings/bulk`, {
                    method: 'GET',
                    credentials: 'include'
                });
                if (dat.status === 200) {
                    const { response } = await dat.json();
                    this.clientSettings = response;
                    return Promise.resolve();
                }
                else {
                    return Promise.reject(`${dat.status}: Failed to fetch client settings`);
                }
            }
            catch (e) {
                return Promise.reject(e.message);
            }
        },
        async postClientSettings(payload) {
            try {
                const myHeaders = new Headers();
                myHeaders.append("Content-Type", `application/json`);
                const response = await fetch(`${import.meta.env.VITE_API_URL}/clientSettings`, {
                    method: 'POST',
                    headers: myHeaders,
                    credentials: 'include',
                    body: JSON.stringify(payload)
                });
                if (response.status === 200 || response.status === 201) {
                    return Promise.resolve(response.json());
                }
                else {
                    return Promise.reject(`${response.status}: Failed to post client settings`);
                }
            }
            catch (e) {
                return Promise.reject(e.message);
            }
        }
    }
});
//# sourceMappingURL=client-settings-store.js.map