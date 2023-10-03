import { defineStore } from "pinia";
import ResponseError from "../utils/responseError";
export const useLoanRequest = defineStore('loan-request-store', {
    state: () => ({
        loanRequest: null,
        loanRequests: [],
        memberLoanRequests: [],
        guaranteedLoanRequests: [],
        witnessedLoanRequests: [],
        paginationData: null,
        memberLoanRequestsPaginationData: null,
        guaranteedLoanRequestsPaginationData: null,
        witnessedLoanRequestsPaginationData: null,
        loanRequestSummary: null
    }),
    getters: {
        getLoanRequest(state) {
            if (state.loanRequest?.zohoRequest) {
                console.log(JSON.parse(state.loanRequest?.zohoRequest));
            }
            return state.loanRequest;
        },
        getLoanRequests(state) {
            return state.loanRequests;
        },
        getMemberLoanRequests(state) {
            return state.memberLoanRequests;
        },
        getGuaranteedLoanRequests(state) {
            return state.guaranteedLoanRequests;
        },
        getWitnessedLoanRequests(state) {
            return state.witnessedLoanRequests;
        },
        getPaginationData(state) {
            return state.paginationData;
        },
        getMemberLoanRequestsPaginationData(state) {
            return state.memberLoanRequestsPaginationData;
        },
        getGuaranteedLoanRequestsPaginationData(state) {
            return state.guaranteedLoanRequestsPaginationData;
        },
        getWitnessedLoanRequestsPaginationData(state) {
            return state.witnessedLoanRequestsPaginationData;
        },
        getLoanRequestsSummary(state) {
            return state.loanRequestSummary;
        }
    },
    actions: {
        async replaceGuarantor({ loanRequestRefId, oldGuarantorRef, newGuarantorRef }) {
            try {
                const myHeaders = new Headers();
                myHeaders.append("Content-Type", `application/json`);
                const res = await fetch(`${import.meta.env.VITE_API_URL}/loan-request/${loanRequestRefId}/guarantor/${oldGuarantorRef}`, {
                    method: 'POST',
                    headers: myHeaders,
                    credentials: 'include',
                    body: JSON.stringify({
                        memberRefId: newGuarantorRef
                    })
                });
                if (!res.ok) {
                    throw new ResponseError('Bad fetch response', res);
                }
                const data = await res.json();
                return Promise.resolve(data);
            }
            catch (err) {
                switch (err.response.status) {
                    case 400:
                        return Promise.reject(`${err.response.status}:`);
                    case 401:
                        return Promise.reject(`${err.response.status}:`);
                    case 404:
                        return Promise.reject(`${err.response.status}:`);
                    case 500:
                        return Promise.reject(`${err.response.status}:`);
                }
            }
        },
        async closeLoanRequest(refId) {
            try {
                const myHeaders = new Headers();
                myHeaders.append("Content-Type", `application/json`);
                const response = await fetch(`${import.meta.env.VITE_API_URL}/loan-request/${refId}/status/CLOSED`, {
                    method: 'POST',
                    headers: myHeaders,
                    credentials: 'include'
                });
                if (response.status === 200) {
                    const data = await response.text();
                    console.log(data);
                    return Promise.resolve('Loan request closed!');
                }
                else {
                    return Promise.reject('Could not close loan request!');
                }
            }
            catch (e) {
                console.error("closeLoanRequest", e);
                return Promise.reject('Could not close loan request!');
            }
        },
        async downloadCompletionCertificate(payload) {
            try {
                const myHeaders = new Headers();
                myHeaders.append("Content-Type", `application/json`);
                const response = await fetch(`${import.meta.env.VITE_API_URL}/zoho/completioncertificate`, {
                    method: 'POST',
                    headers: myHeaders,
                    credentials: 'include',
                    body: JSON.stringify(payload)
                });
                if (response.status === 200) {
                    const data = await response.text();
                    console.log(data);
                    return Promise.resolve(data);
                }
                else {
                    return Promise.reject('Could not resubmit loan request for signing!');
                }
            }
            catch (e) {
                console.error("fetchLoanRequest", e);
                return Promise.reject('Could not resubmit loan request for signing!');
            }
        },
        async resubmitForSigning(refId, sendNotification = false) {
            try {
                const myHeaders = new Headers();
                myHeaders.append("Content-Type", `application/json`);
                const response = await fetch(`${import.meta.env.VITE_API_URL}/loan-request/${refId}/sign?sendNotification=${sendNotification}`, {
                    method: 'POST',
                    headers: myHeaders,
                    credentials: 'include',
                });
                if (response.status === 200) {
                    return Promise.resolve('Loan request resubmission successful!');
                }
                else {
                    return Promise.reject('Could not resubmit loan request for signing!');
                }
            }
            catch (e) {
                console.error("fetchLoanRequest", e);
                return Promise.reject('Could not resubmit loan request for signing!');
            }
        },
        async voidLoanRequest(loanRequestNumber) {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/core-banking/loan-request/${loanRequestNumber}`, {
                    method: 'DELETE',
                    credentials: 'include',
                });
                if (response.status === 200) {
                    return Promise.resolve('Loan request voided successful!');
                }
                else {
                    return Promise.reject('Could not void loan request!');
                }
            }
            catch (e) {
                console.error("voidLoanRequest", e);
                return Promise.reject('Could not void loan request!');
            }
        },
        async approveGuarantor(guarantorshipRequestRefId, approve) {
            try {
                const myHeaders = new Headers();
                myHeaders.append("Content-Type", `application/json`);
                const response = await fetch(`${import.meta.env.VITE_API_URL}/guarantorship-request/${guarantorshipRequestRefId}/guarantor/${approve}`, {
                    method: 'POST',
                    headers: myHeaders,
                    credentials: 'include',
                });
                if (response.status === 200) {
                    return Promise.resolve(`Guarantor ${approve ? 'approved' : 'declined'}!`);
                }
                else {
                    return Promise.reject(`Could not ${approve ? 'approve' : 'decline'} guarantor!`);
                }
            }
            catch (e) {
                console.error("approveGuarantor", e);
                return Promise.reject(`Could not ${approve ? 'approve' : 'decline'} guarantor!`);
            }
        },
        async submitToCoBanking(loanRequestNumber) {
            try {
                const myHeaders = new Headers();
                myHeaders.append("Content-Type", `application/json`);
                const response = await fetch(`${import.meta.env.VITE_API_URL}/core-banking/forward-loan-request/${loanRequestNumber}`, {
                    method: 'POST',
                    headers: myHeaders,
                    credentials: 'include',
                });
                if (response.status === 200) {
                    return Promise.resolve('Loan request submission successful!');
                }
                else {
                    return Promise.reject('Could not submit loan request to co-banking!');
                }
            }
            catch (e) {
                console.error("fetchLoanRequest", e);
                return Promise.reject('Could not submit loan request to co-banking!');
            }
        },
        async fetchLoanRequest(refId) {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/loan-request/${refId}`, {
                    method: 'GET',
                    credentials: 'include'
                });
                if (response.status === 200) {
                    const data = await response.json();
                    this.loanRequest = data;
                    return Promise.resolve(data);
                }
                else {
                    return Promise.reject(`${response.status}: Failed to fetch loan request.`);
                }
            }
            catch (e) {
                console.error("fetchLoanRequest", e);
                return Promise.reject(e.message);
            }
        },
        async fetchLoanRequests(params) {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/loan-request/query${params ? params : ''}`, {
                    method: 'GET',
                    credentials: 'include'
                });
                if (response.status === 200) {
                    const { content, totalPages, totalElements } = await response.json();
                    this.loanRequests = content;
                    this.paginationData = {
                        totalPages: totalPages,
                        totalElements: totalElements,
                    };
                    return Promise.resolve(content);
                }
                else {
                    return Promise.reject(`${response.status}: Failed to fetch loan requests.`);
                }
            }
            catch (e) {
                console.error("fetchLoanRequest", e);
                return Promise.reject(e.message);
            }
        },
        async fetchMemberLoanRequests(params) {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/loan-request/query${params ? params : ''}`, {
                    method: 'GET',
                    credentials: 'include'
                });
                if (response.status === 200) {
                    const { content, totalPages, totalElements } = await response.json();
                    this.memberLoanRequests = content;
                    this.memberLoanRequestsPaginationData = {
                        totalPages: totalPages,
                        totalElements: totalElements,
                    };
                    return Promise.resolve(content);
                }
                else {
                    return Promise.reject(`${response.status}: Failed to fetch loan requests.`);
                }
            }
            catch (e) {
                console.error("fetchLoanRequest", e);
                return Promise.reject(e.message);
            }
        },
        async fetchMemberGuaranteedLoanRequests(params) {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/loan-request/query${params ? params : ''}`, {
                    method: 'GET',
                    credentials: 'include'
                });
                if (response.status === 200) {
                    const { content, totalPages, totalElements } = await response.json();
                    this.guaranteedLoanRequests = content;
                    this.guaranteedLoanRequestsPaginationData = {
                        totalPages: totalPages,
                        totalElements: totalElements,
                    };
                    return Promise.resolve(content);
                }
                else {
                    return Promise.reject(`${response.status}: Failed to fetch loan requests.`);
                }
            }
            catch (e) {
                console.error("fetchLoanRequest", e);
                return Promise.reject(e.message);
            }
        },
        async fetchMemberWitnessedLoanRequests(params) {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/loan-request/query${params ? params : ''}`, {
                    method: 'GET',
                    credentials: 'include'
                });
                if (response.status === 200) {
                    const { content, totalPages, totalElements } = await response.json();
                    this.witnessedLoanRequests = content;
                    this.witnessedLoanRequestsPaginationData = {
                        totalPages: totalPages,
                        totalElements: totalElements,
                    };
                    return Promise.resolve(content);
                }
                else {
                    return Promise.reject(`${response.status}: Failed to fetch loan requests.`);
                }
            }
            catch (e) {
                console.error("fetchLoanRequest", e);
                return Promise.reject(e.message);
            }
        },
        async fetchLoanRequestSummary(params) {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/reports/loans/summary${params ? params : ''}`, {
                    method: 'GET',
                    credentials: 'include'
                });
                if (response.status === 200) {
                    const content = await response.json();
                    this.loanRequestSummary = content;
                    return Promise.resolve(content);
                }
                else {
                    return Promise.reject(`${response.status}: Failed to fetch loan request summary.`);
                }
            }
            catch (e) {
                console.error("fetchLoanRequestSummary", e);
                return Promise.reject(e.message);
            }
        },
        async exportLoanRequests(params) {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/reports/loans${params ? params : ''}`, {
                    method: 'GET',
                    credentials: 'include'
                });
                if (response.status === 200) {
                    const content = await response.blob();
                    return Promise.resolve(URL.createObjectURL(content));
                }
                else {
                    return Promise.reject(`${response.status}: Failed to export loan requests.`);
                }
            }
            catch (e) {
                console.error("exportLoanRequests", e);
                return Promise.reject(e.message);
            }
        },
        async deleteLoanRequest(loanRequestNumber) {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/loan-request/${loanRequestNumber}`, {
                    method: 'DELETE',
                    credentials: 'include'
                });
                if (response.status === 200) {
                    const data = await response.text();
                    return Promise.resolve(data);
                }
                else {
                    return Promise.reject(`${response.status}: Failed to delete loan request.`);
                }
            }
            catch (e) {
                console.error("deleteLoanRequest", e);
                return Promise.reject(e.message);
            }
        }
    }
});
//# sourceMappingURL=loan-request-store.js.map