import {defineStore} from "pinia";

interface GuarantorData {
    refId: string,
    memberNumber: string,
    memberRefId: string,
    firstName: string,
    lastName: string,
    dateAccepted?: string,
    isAccepted?: string,
    dateSigned?: string,
    isSigned?: boolean,
    isActive: boolean,
    committedAmount: number,
    availableAmount: number,
    totalDeposits: number
}

export interface LoanRequestData {
    refId: string,
    loanDate: string,
    loanRequestNumber: string,
    loanProductName: string,
    loanProductRefId: string,
    loanAmount: number,
    guarantorsRequired: number,
    guarantorCount: number,
    status: string,
    signingStatus: string,
    acceptanceStatus: string,
    applicationStatus: string,
    memberRefId: string,
    memberNumber: string,
    memberFirstName: string,
    memberLastName: string,
    phoneNumber: string,
    loanRequestProgress?: number,
    totalDeposits?: number,
    applicantSigned?: boolean,
    witnessName?: string,
    guarantorList?: GuarantorData[],
}

interface PaginationData {
    totalPages: number;
    totalElements: number;
}

interface LoanRequestState {
    loanRequests: LoanRequestData[],
    paginationData: PaginationData | null
}

export const useLoanRequest = defineStore('loan-request-store', {
    state: (): LoanRequestState => ({
        loanRequests: [],
        paginationData: null
    }),
    getters: {
        getLoanRequests(state) {
            return state.loanRequests
        },
        getPaginationData(state) {
            return state.paginationData
        }
    },
    actions: {
        async fetchLoanRequests(params?: string) {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/loan-request${params ? params : ''}`, {
                    method: 'GET',
                    credentials: 'include'
                });
                if (response.status === 200) {
                    const {content, totalPages, totalElements} = await response.json();
                    this.loanRequests = content;
                    this.paginationData = {
                        totalPages: totalPages,
                        totalElements: totalElements,
                    };
                    return Promise.resolve(content);
                } else {
                    return Promise.reject(`${response.status}: Failed to fetch loan requests.`);
                }
            } catch (e: any) {
                console.error("fetchLoanRequest",  e);
                return Promise.reject(e.message);
            }
        }
    }
})