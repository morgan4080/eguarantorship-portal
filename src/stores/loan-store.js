import { defineStore } from "pinia";
export const useLoan = defineStore('loan-store', {
    state: () => ({
        loanSummary: null
    }),
    getters: {
        getLoanSummary(state) {
            return state.loanSummary;
        }
    },
    actions: {
        async fetchLoanSummary(params) {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/loans/summary${params ? params : ''}`, {
                    method: 'GET',
                    credentials: 'include'
                });
                if (response.status === 200) {
                    const { counts } = await response.json();
                    this.loanSummary = counts;
                    return Promise.resolve(counts);
                }
                else {
                    console.log(`${response.status}: Failed to fetch loan summary.`);
                    return Promise.reject(`${response.status}: Failed to fetch loan summary.`);
                }
            }
            catch (e) {
                console.error("fetchLoanSummary", e.message);
                return Promise.reject(e.message);
            }
        }
    }
});
//# sourceMappingURL=loan-store.js.map