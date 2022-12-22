import {defineStore} from "pinia";

export interface GuarantorData {
    refId: string,
    memberNumber: string,
    memberRefId: string,
    firstName: string,
    lastName: string,
    dateAccepted?: string,
    isAccepted?: string,
    dateSigned?: string,
    isSigned?: boolean,
    isApproved?: boolean,
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
    zohoDocumentId?: string,
    zohoRequestId?: string,
    guarantorList?: GuarantorData[],
    pdfThumbNail?: string,
    pendingReason?: string,
    readableErrorMessage?: string,
    witnessRefId?: string,
    witnessMemberNo?: string,
    witnessAccepted?: boolean,
    witnessSigned?: boolean,
    details: Record<string, Record<string, string>>
}

export interface PaginationData {
    totalPages: number;
    totalElements: number;
}

interface LoanRequestSummary {
    averageDaysToComplete: number
    totalRequests: number
    todayRequests: number
    totalRequested: number
}

interface LoanRequestState {
    loanRequest: LoanRequestData | null,
    loanRequests: LoanRequestData[],
    paginationData: PaginationData | null
    loanRequestSummary: LoanRequestSummary | null
}

export const useLoanRequest = defineStore('loan-request-store', {
    state: (): LoanRequestState => ({
        loanRequest: null,
        loanRequests: [],
        paginationData: null,
        loanRequestSummary: null
    }),
    getters: {
        getLoanRequest(state) {
            return state.loanRequest
        },
        getLoanRequests(state) {
            return state.loanRequests
        },
        getPaginationData(state) {
            return state.paginationData
        },
        getLoanRequestsSummary(state) {
            return state.loanRequestSummary
        }
    },
    actions: {
        async closeLoanRequest(refId: string) {
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
                } else {
                    return Promise.reject('Could not close loan request!');
                }
            } catch (e: any) {
                console.error("closeLoanRequest",  e);
                return Promise.reject('Could not close loan request!');
            }
        },
        async downloadCompletionCertificate(payload: { zohoRequestId: string}) {
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
                    console.log(data)
                    return Promise.resolve(data);
                } else {
                    return Promise.reject('Could not resubmit loan request for signing!');
                }
            } catch (e: any) {
                console.error("fetchLoanRequest",  e);
                return Promise.reject('Could not resubmit loan request for signing!');
            }
        },
        async resubmitForSigning(refId: string, sendNotification = false) {
            try {
                const myHeaders = new Headers();
                myHeaders.append("Content-Type", `application/json`);
                const response = await fetch(`${import.meta.env.VITE_API_URL}/loan-request/${refId}/retry?sendNotification=${sendNotification}`, {
                    method: 'POST',
                    headers: myHeaders,
                    credentials: 'include',
                });
                if (response.status === 200) {
                    return Promise.resolve('Loan request resubmission successful!');
                } else {
                    return Promise.reject('Could not resubmit loan request for signing!');
                }
            } catch (e: any) {
                console.error("fetchLoanRequest",  e);
                return Promise.reject('Could not resubmit loan request for signing!');
            }
        },
        async voidLoanRequest(loanRequestNumber: string) {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/core-banking/loan-request/${loanRequestNumber}`, {
                    method: 'DELETE',
                    credentials: 'include',
                });

                if (response.status === 200) {
                    return Promise.resolve('Loan request voided successful!');
                } else {
                    return Promise.reject('Could not void loan request!');
                }

            } catch (e: any) {
                console.error("voidLoanRequest",  e);
                return Promise.reject('Could not void loan request!');
            }
        },
        async approveGuarantor(guarantorRefId: string) {
            try {
                const myHeaders = new Headers();
                myHeaders.append("Content-Type", `application/json`);
                const response = await fetch(`${import.meta.env.VITE_API_URL}/guarantorship-request/${guarantorRefId}/guarantor/true`, {
                    method: 'POST',
                    headers: myHeaders,
                    credentials: 'include',
                });
                if (response.status === 200) {
                    return Promise.resolve('Guarantor approved!');
                } else {
                    return Promise.reject('Could not approve guarantor!');
                }
            } catch (e: any) {
                console.error("approveGuarantor",  e);
                return Promise.reject('Could not approve guarantor!');
            }
        },
        async submitToCoBanking(loanRequestNumber: string) {
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
                } else {
                    return Promise.reject('Could not submit loan request to co-banking!');
                }
            } catch (e: any) {
                console.error("fetchLoanRequest",  e);
                return Promise.reject('Could not submit loan request to co-banking!');
            }
        },
        async fetchLoanRequest(refId: string) {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/loan-request/${refId}`, {
                    method: 'GET',
                    credentials: 'include'
                });
                if (response.status === 200) {
                    const data = await response.json();
                    this.loanRequest = data;
                    return Promise.resolve(data);
                } else {
                    return Promise.reject(`${response.status}: Failed to fetch loan request.`);
                }
            } catch (e: any) {
                console.error("fetchLoanRequest",  e);
                return Promise.reject(e.message);
            }
        },
        async fetchLoanRequests(params?: string) {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/loan-request/query${params ? params : ''}`, {
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
        },
        async fetchLoanRequestSummary(params?:string) {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/loan-request/summary${params ? params : ''}`, {
                    method: 'GET',
                    credentials: 'include'
                });
                if (response.status === 200) {
                    const content = await response.json();
                    this.loanRequestSummary = content;
                    return Promise.resolve(content);
                } else {
                    return Promise.reject(`${response.status}: Failed to fetch loan request summary.`);
                }
            } catch (e: any) {
                console.error("fetchLoanRequestSummary",  e);
                return Promise.reject(e.message);
            }
        },
        async exportLoanRequests(params?:string) {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/reports/loans${params ? params : ''}`, {
                    method: 'GET',
                    credentials: 'include'
                });
                if (response.status === 200) {
                    const content = await response.blob();
                    return Promise.resolve(URL.createObjectURL(content));
                } else {
                    return Promise.reject(`${response.status}: Failed to export loan requests.`);
                }
            } catch (e: any) {
                console.error("exportLoanRequests",  e);
                return Promise.reject(e.message);
            }
        },
        async deleteLoanRequest(loanRequestNumber: string) {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/loan-request/${loanRequestNumber}`, {
                    method: 'DELETE',
                    credentials: 'include'
                });
                if (response.status === 200) {
                    const data = await response.text();
                    return Promise.resolve(data);
                } else {
                    return Promise.reject(`${response.status}: Failed to delete loan request.`);
                }
            } catch (e: any) {
                console.error("deleteLoanRequest",  e);
                return Promise.reject(e.message);
            }
        }
    }
})