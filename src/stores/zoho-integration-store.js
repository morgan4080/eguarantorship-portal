import { defineStore } from "pinia";
export const useZohoStore = defineStore('zoho-integration-store', {
    state: () => ({
        zoho: null,
        templates: [],
        templateDetails: []
    }),
    getters: {
        getZohoDetails(state) {
            return state.zoho;
        },
        getZohoTemplates(state) {
            return state.templates;
        },
        getZohoTemplateDetails(state) {
            return state.templateDetails;
        }
    },
    actions: {
        async fetchTemplateDetails(templateId) {
            try {
                const dat = await fetch(`${import.meta.env.VITE_API_URL}/zoho/template-details?templateId=${templateId}`, {
                    method: 'GET',
                    credentials: 'include'
                });
                if (dat.status === 200) {
                    const { response } = await dat.json();
                    this.templateDetails = response;
                    return Promise.resolve(response.json());
                }
                else {
                    return Promise.reject(`${dat.status}: Failed to fetch template details`);
                }
            }
            catch (e) {
                return Promise.reject(e.message);
            }
        },
        async fetchLoanProductTemplates() {
            try {
                const dat = await fetch(`${import.meta.env.VITE_API_URL}/zoho/templates`, {
                    method: 'GET',
                    credentials: 'include'
                });
                if (dat.status === 200) {
                    const { response } = await dat.json();
                    this.templates = response;
                    return Promise.resolve(response.json());
                }
                else {
                    return Promise.reject(`${dat.status}: Failed to fetch zoho templates`);
                }
            }
            catch (e) {
                return Promise.reject(e.message);
            }
        },
        async fetchZohoCredentials() {
            try {
                const dat = await fetch(`${import.meta.env.VITE_API_URL}/zoho`, {
                    method: 'GET',
                    credentials: 'include'
                });
                if (dat.status === 200) {
                    const { response } = await dat.json();
                    this.zoho = response;
                }
                else {
                    return Promise.reject(`${dat.status}: Failed to fetch zoho credentials.`);
                }
            }
            catch (e) {
                console.error("fetchZohoCredentials", e.message);
                return Promise.reject(e);
            }
        },
        async submitCredentials(payload) {
            try {
                const myHeaders = new Headers();
                myHeaders.append("Content-Type", `application/json`);
                const response = await fetch(`${import.meta.env.VITE_API_URL}/zoho`, {
                    method: 'POST',
                    credentials: 'include',
                    headers: myHeaders,
                    body: JSON.stringify(payload)
                });
                if (response.status === 200) {
                    const data = await response.json();
                    console.log(`${response.status}`, data);
                    return Promise.resolve(data);
                }
                else {
                    console.error(`${response.status}: Failed to submit zoho credentials.`);
                    return Promise.reject(`${response.status}: Failed to submit zoho credentials.`);
                }
            }
            catch (e) {
                console.error("submitCredentials", e.message);
                return Promise.reject(e.message);
            }
        }
    }
});
//# sourceMappingURL=zoho-integration-store.js.map