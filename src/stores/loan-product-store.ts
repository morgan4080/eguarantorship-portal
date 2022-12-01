import {defineStore} from "pinia";

interface LoanProduct {
    refId: string;
    name: string;
    interestRate: number;
    requiredGuarantors: number;
}

interface LoanProductState {
    loanProducts: LoanProduct[],
}
export const useLoanProduct = defineStore('loan-product-store', {
    state: (): LoanProductState => ({
        loanProducts: [],
    }),
    getters: {
        getLoanProducts(state) {
            return state.loanProducts
        },
    },
    actions: {
        async fetchLoanProducts(): Promise<any> {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/loans-products`, {
                    method: 'GET',
                    credentials: 'include'
                })
                if (response.status === 200) {
                    const {list} = await response.json()
                    this.loanProducts = list
                    return Promise.resolve(response.json())
                } else {
                    return Promise.reject(`${response.status}: Failed to fetch loan products`)
                }
            } catch (e: any) {
                return Promise.reject(e.message)
            }
        }
    }
})