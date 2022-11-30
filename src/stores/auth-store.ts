import { defineStore } from 'pinia';

interface LoanProduct {
    refId: string;
    name: string;
    interestRate: number;
    requiredGuarantors: number;
}

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

interface LoanRequestData {
    "refId": string,
    "loanDate": string,
    "loanRequestNumber": string,
    "loanProductName": string,
    "loanProductRefId": string,
    "loanAmount": number,
    "guarantorsRequired": number,
    "guarantorCount": number,
    "status": string,
    "signingStatus": string,
    "acceptanceStatus": string,
    "applicationStatus": string,
    "memberRefId": string,
    "memberNumber": string,
    "memberFirstName": string,
    "memberLastName": string,
    "phoneNumber": string,
    "loanRequestProgress": number,
    "totalDeposits": number,
    "applicantSigned": boolean,
    "witnessName": string,
    "guarantorList": GuarantorData[],
}

interface MainState {
    isLoggedIn: boolean,
    user: null | {
        keycloakId: string,
        username: string,
        email: string,
        firstName: string,
        lastName: string,
        tenantId: string,
        companyName: string,
        roles: {}
    },
    notification: {
        message: string | null,
        success: boolean,
        warning: boolean,
        error: boolean,
    },
    loanProducts: LoanProduct[] | null,
    loanRequests: LoanRequestData[] | null,
    loading: boolean
}

export const useMainStore = defineStore('auth-store', {
    state: (): MainState => ({
        isLoggedIn: false,
        user: null,
        notification: {
            message: null,
            success: false,
            warning: false,
            error: false,
        },
        loanProducts: null,
        loanRequests: null,
        loading: false,
    }),
    getters: {
        getLoggedInState(state) {
            return state.isLoggedIn
        },
        getLoggedInUser(state) {
            return state.user
        },
        getNotification(state) {
            return state.notification
        },
        getLoanProducts(state) {
            return state.loanProducts
        },
        getLoanRequests(state) {
            return state.loanRequests
        },
        getLoadingState(state) {
            return state.loading
        }
    },
    actions: {
        setLoading(payload: boolean): void {
            this.loading = payload
        },
        async initialize(): Promise<any> {
            const url = `${import.meta.env.VITE_APP_USER}`
            try {
                const response = await fetch(url, {
                    method: 'GET',
                    credentials: 'include'
                });

                if (response.status === 200) {
                    return Promise.resolve(response.json())
                } else {
                    return Promise.reject(response.status)
                }
            } catch (e: any) {
                return Promise.reject(e.message)
            }
        },
        setAuthState(data: any): void {
            this.user = data;
            this.isLoggedIn = true;
        },
        defineNotification(payload: { message: string, success?: boolean, warning?: boolean, error?: boolean }) {
            this.notification = {
                ...this.notification,
                ...payload
            }
            setTimeout(() => {
                this.notification = {
                    message: null,
                    success: false,
                    warning: false,
                    error: false,
                }
            }, 10000)
        },
        async fetchLoanProducts(): Promise<any> {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/loans-products`, {
                    method: 'GET',
                    credentials: 'include'
                })
                if (response.status === 200) {
                    this.loanProducts = await response.json()
                    return Promise.resolve(response.json())
                } else {
                    return Promise.reject(`${response.status}: Failed to fetch loan products`)
                }
            } catch (e: any) {
                return Promise.reject(e.message)
            }
        }
    }
});