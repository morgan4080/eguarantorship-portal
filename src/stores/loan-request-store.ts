import {defineStore} from "pinia";
interface LoanRequestState {
    loanRequests: []
}
export const useLoanRequest = defineStore('loan-request-store', {
    state: (): LoanRequestState => ({
        loanRequests: []
    }),

})