import { defineStore } from "pinia";
export const useLoanProduct = defineStore('loan-product-store', {
    state: () => ({
        loanProducts: [],
        loanProduct: null,
        paginationData: null,
    }),
    getters: {
        getLoanProducts(state) {
            return state.loanProducts;
        },
        getLoanProduct(state) {
            return state.loanProduct;
        },
        getPaginationData(state) {
            return state.paginationData;
        }
    },
    actions: {
        async fetchLoanProducts(query) {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/loans-products${query ? query : ''}`, {
                    method: 'GET',
                    credentials: 'include'
                });
                if (response.status === 200) {
                    const { list, total } = await response.json();
                    this.loanProducts = list;
                    this.paginationData = {
                        totalPages: 1,
                        totalElements: total
                    };
                    return Promise.resolve(list);
                }
                else {
                    return Promise.reject(`${response.status}: Failed to fetch loan products`);
                }
            }
            catch (e) {
                return Promise.reject(e.message);
            }
        },
        async fetchLoanProduct(refId) {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/loans-products/${refId}`, {
                    method: 'GET',
                    credentials: 'include'
                });
                if (response.status === 200) {
                    const data = await response.json();
                    this.loanProduct = data;
                    return Promise.resolve(data);
                }
                else {
                    return Promise.reject(`${response.status}: Failed to fetch loan product`);
                }
            }
            catch (e) {
                return Promise.reject(e.message);
            }
        },
        async deleteLoanProduct(refId) {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/loans-products/${refId}`, {
                    "headers": {
                        "accept": "*/*",
                        "accept-language": "en-US,en;q=0.9,ja;q=0.8",
                        "content-type": "application/json"
                    },
                    "referrerPolicy": "strict-origin-when-cross-origin",
                    "method": "DELETE",
                    "mode": "cors",
                    "credentials": "include"
                });
                if (response.status === 200) {
                    return Promise.resolve(response.json());
                }
                else {
                    return Promise.reject(`${response.status}: Failed to delete loan product`);
                }
            }
            catch (e) {
                return Promise.reject(e.message);
            }
        },
        async postLoanProduct(payload) {
            try {
                const myHeaders = new Headers();
                myHeaders.append("Content-Type", `application/json`);
                const response = await fetch(`${import.meta.env.VITE_API_URL}/loans-products`, {
                    method: 'POST',
                    headers: myHeaders,
                    credentials: 'include',
                    body: JSON.stringify(payload)
                });
                if (response.status === 200) {
                    return Promise.resolve(response.json());
                }
                else {
                    return Promise.reject(`${response.status}: Failed to post loan product`);
                }
            }
            catch (e) {
                return Promise.reject(e.message);
            }
        }
    }
});
//# sourceMappingURL=loan-product-store.js.map