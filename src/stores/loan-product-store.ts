import {defineStore} from "pinia";
import {PaginationData} from "./loan-request-store";

export type LoanProductFormType = {
    name: string;
    interestRate: string;
    requiredGuarantors: string;
    maxPeriod: string;
    coreBankingLoanTypeCode: string;
    templateName: string;
    templateId: string;
    refId: string;
    roleActions: {
        role: string;
        action_id: string;
        action_type: string;
        recipient_name: string;
        recipient_phonenumber: string;
        is_embedded: boolean;
        recipient_email: string;
        private_notes: string;
        verify_recipient: boolean;
    }[];
    details: any;
}
interface LoanProduct {
    refId: string;
    name: string;
    interestRate: number;
    requiredGuarantors: number;
    maxPeriod: string;
}

type LoanProductItem = {
    refId: string;
    name: string;
    interestRate: number;
    maxPeriod: string;
    coreBankingLoanTypeCode: string;
    requiredGuarantors: number;
    roleActions: any[];
    templateId: string;
    templateName: string;
    details: any;
}

interface LoanProductState {
    loanProducts: LoanProduct[];
    loanProduct: LoanProductItem | null;
    paginationData: PaginationData | null;
}
export const useLoanProduct = defineStore('loan-product-store', {
    state: (): LoanProductState => ({
        loanProducts: [],
        loanProduct: null,
        paginationData: null,
    }),
    getters: {
        getLoanProducts(state) {
            return state.loanProducts
        },
        getLoanProduct(state) {
            return state.loanProduct
        },
        getPaginationData(state) {
            return state.paginationData
        }
    },
    actions: {
        async fetchLoanProducts(query?: string): Promise<any> {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/loans-products${query ? query : ''}`, {
                    method: 'GET',
                    credentials: 'include'
                })
                if (response.status === 200) {
                    const {list, total} = await response.json()
                    this.loanProducts = list
                    this.paginationData = {
                        totalPages: 1,
                        totalElements: total
                    }
                    return Promise.resolve(list)
                } else {
                    return Promise.reject(`${response.status}: Failed to fetch loan products`)
                }
            } catch (e: any) {
                return Promise.reject(e.message)
            }
        },
        async fetchLoanProduct(refId: string): Promise<any> {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/loans-products/${refId}`, {
                    method: 'GET',
                    credentials: 'include'
                })
                if (response.status === 200) {
                    const data = await response.json()
                    this.loanProduct = data
                    return Promise.resolve(data)
                } else {
                    return Promise.reject(`${response.status}: Failed to fetch loan product`)
                }
            } catch (e: any) {
                return Promise.reject(e.message)
            }
        },
        async deleteLoanProduct(refId: string): Promise<any> {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/loans-products/${refId}`, {
                    method: 'DELETE',
                    credentials: 'include'
                })
                if (response.status === 200) {
                    return Promise.resolve(response.json())
                } else {
                    return Promise.reject(`${response.status}: Failed to delete loan product`)
                }
            } catch (e: any) {
                return Promise.reject(e.message)
            }
        },
        async postLoanProduct(payload: {refId?: string, name: string, interestRate: string, requiredGuarantors: string, maxPeriod: string, coreBankingLoanTypeCode: string, templateName: string, templateId: string, roleActions: { role: string; action_id: string; action_type: string; recipient_name: string; recipient_phonenumber: string; is_embedded: boolean; recipient_email: string; private_notes: string; verify_recipient: boolean; }[], details: any}): Promise<any> {
            try {
                const myHeaders = new Headers();
                myHeaders.append("Content-Type", `application/json`);
                const response = await fetch(`${import.meta.env.VITE_API_URL}/loans-products`, {
                    method: 'POST',
                    headers: myHeaders,
                    credentials: 'include',
                    body: JSON.stringify(payload)
                })
                if (response.status === 200) {
                    return Promise.resolve(response.json())
                } else {
                    return Promise.reject(`${response.status}: Failed to post loan product`)
                }
            } catch (e: any) {
                return Promise.reject(e.message)
            }
        }
    }
})