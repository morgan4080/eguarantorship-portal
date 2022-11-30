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

interface LoanRequestState {
    loanRequests: LoanRequestData[] | null,
}

export const useLoanRequest = defineStore('loan-request-store', {
    state: (): LoanRequestState => ({
        loanRequests: []
    }),
    getters: {
        getLoanRequests(state) {
            return state.loanRequests
        },
    }
})