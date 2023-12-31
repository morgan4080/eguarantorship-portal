import {defineStore} from "pinia";
import {PaginationData} from "./loan-request-store";
import ResponseError from "../utils/responseError";
export interface Member {
    isTermsAccepted: boolean
    refId: string
    created: string
    createdBy: string
    updated: string
    updatedBy: string
    firstName: string
    fullName: string
    lastName: string
    idNumber: string
    memberNumber: string
    phoneNumber: string
    email: string
    totalShares: number
    totalDeposits: number
    committedAmount: number
    availableAmount: number
    memberStatus: string
    details: Record<string, Record<string, string>>
}
interface MemberSummary {
    DECEASED: number
    DORMANT: number
    ACTIVE: number
    EXITED: number
}
interface MemberState {
    members: Member[]
    paginationData: PaginationData | null
    memberSummary: MemberSummary | null
    memberDetails: Member | null
    memberViewData: string | null
    memberHeader: any[]
}
interface MemberDetailSubmit {
    firstName: string,
    pinSecret: string,
    lastName: string,
    idNumber: string,
    memberNumber: string,
    phoneNumber: string,
    email: string,
    totalShares: string,
    totalDeposits: string,
    committedAmount: number,
    availableAmount: string,
    memberStatus: string,
    isTermsAccepted: boolean,
    fullName: string,
}

export const useMember = defineStore('member-store', {
    state: (): MemberState => ({
        members: [],
        paginationData: null,
        memberSummary: null,
        memberDetails: null,
        memberViewData: null,
        memberHeader: []
    }),
    getters: {
        getMembers(state) {
            return state.members
        },
        getPaginationData(state) {
            return state.paginationData
        },
        getMemberDetails(state) {
            return state.memberDetails
        },
        getMemberSummary(state) {
            return state.memberSummary
        },
        getMemberViewData(state) {
            return state.memberViewData
        },
        getMemberHeader(state) {
            return state.memberHeader
        }
    },
    actions: {
        async initMemberTransfers(params: string) {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/core-banking/init-member-transfers${params ? params : ''}`, {
                    method: 'GET',
                    credentials: 'include'
                });

                if (!response.ok) {
                    throw new ResponseError('Bad fetch response', response)
                }

                const data = await response.text();

                return Promise.resolve(data);
            } catch (err: any) {
                switch (err.response.status) {
                    case 400:
                        return Promise.reject(`${err.response.status}: ${err.response.message}`);
                    case 401:
                        return Promise.reject(`${err.response.status}: ${err.response.message}`);
                    case 404:
                        return Promise.reject(`${err.response.status}: ${err.response.message}`);
                    case 500:
                        return Promise.reject(`${err.response.status}: ${err.response.message}`);
                }
            }
        },
        async getCo_bankingMemberDetails(params?:string) {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/core-banking/member-details${params ? params : ''}`, {
                    method: 'GET',
                    credentials: 'include'
                });
                if (response.status === 200) {
                    const content = await response.json();
                    return Promise.resolve(content);
                } else {
                    return Promise.reject(`${response.status}: Failed to get member.`);
                }
            } catch (e: any) {
                console.error("ge",  e);
                return Promise.reject(e.message);
            }
        },
        async exportMembers(params?:string) {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/reports/members${params ? params : ''}`, {
                    method: 'GET',
                    credentials: 'include'
                });
                if (response.status === 200) {
                    const content = await response.blob();
                    return Promise.resolve(URL.createObjectURL(content));
                } else {
                    return Promise.reject(`${response.status}: Failed to export members.`);
                }
            } catch (e: any) {
                console.error("exportMembers",  e);
                return Promise.reject(e.message);
            }
        },
        async fetchMembers(params?: string) {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/members${params ? params : ''}`, {
                    method: 'GET',
                    credentials: 'include'
                });
                if (response.status === 200) {
                    const {list, total} = await response.json()
                    this.members = list
                    this.paginationData = {
                        totalPages: total/10, // TODO: check query param and remove 10
                        totalElements: total,
                    }
                    return Promise.resolve(list)
                } else {
                    console.error(`${response.status}: Failed to fetch members.`)
                    return Promise.reject(`${response.status}: Failed to fetch members.`)
                }
            } catch (e: any) {
                console.error("fetchMembers",  e.message)
                return Promise.reject(e.message)
            }
        },
        async fetchMembersSummary(params?: string) {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/reports/members/summary${params ? params : ''}`, {
                    method: 'GET',
                    credentials: 'include'
                });
                if (response.status === 200) {
                    const data = await response.json()
                    this.memberSummary = data
                    return Promise.resolve(data)
                } else {
                    console.log(`${response.status}: Failed to fetch member summary.`)
                    return Promise.reject(`${response.status}: Failed to fetch member summary.`)
                }
            } catch (e: any) {
                console.error("fetchMembersSummary",  e.message)
                return Promise.reject(e.message)
            }
        },
        async submitMemberDetails(payload: MemberDetailSubmit[]) {
            try {
                const myHeaders = new Headers();
                myHeaders.append("Content-Type", `application/json`);
                const response = await fetch(`${import.meta.env.VITE_API_URL}/members`, {
                    method: 'POST',
                    credentials: 'include',
                    headers: myHeaders,
                    body: JSON.stringify(payload)
                });
                if (response.status === 200) {
                    const data = await response.json()
                    console.log(`${response.status}`, data)
                    return Promise.resolve(data)
                } else {
                    console.error(`${response.status}: Failed to submit member details.`)
                    return Promise.reject(`${response.status}: Failed to submit member details.`)
                }
            } catch (e: any) {
                console.error("submitMemberDetails",  e.message)
                return Promise.reject(e.message)
            }
        },
        async editMemberDetails(payload: Omit<MemberDetailSubmit, 'pinSecret' | 'memberNumber'> | {refId: string, details: Record<any, any>}, refId: string) {
            try {
                const myHeaders = new Headers();
                myHeaders.append("Content-Type", `application/json`);
                const response = await fetch(`${import.meta.env.VITE_API_URL}/members/${refId}`, {
                    method: 'PUT',
                    credentials: 'include',
                    headers: myHeaders,
                    body: JSON.stringify(payload)
                });
                if (response.status === 200) {
                    const data = await response.json()
                    console.log(`${response.status}`, data)
                    return Promise.resolve(data)
                } else {
                    console.error(`${response.status}: Failed to edit member details.`)
                    return Promise.reject(`${response.status}: Failed to edit member details.`)
                }
            } catch (e: any) {
                console.error("editMemberDetails",  e.message)
                return Promise.reject(e.message)
            }
        },
        async fetchMember(refId: string) {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/members/${refId}`, {
                    method: 'GET',
                    credentials: 'include'
                });
                if (response.status === 200) {
                    const data = await response.json()
                    console.log(`${response.status}`, data)
                    this.memberDetails = data
                    return Promise.resolve(data)
                } else {
                    console.error(`${response.status}: Failed to fetch member details.`)
                    return Promise.reject(`${response.status}: Failed to fetch member details.`)
                }
            } catch (e: any) {
                console.error("fetchMember",  e.message)
                return Promise.reject(e.message)
            }
        },
        setMemberViewData(str: string) {
            this.memberViewData = str
        },
        setMemberHeader(headers: []) {
            this.memberHeader = headers
        },
        async importapi(data: any) {
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", `application/json`);
            return await fetch(`${import.meta.env.VITE_API_URL}/members`, {
                method: 'POST',
                body: JSON.stringify(data),
                credentials: 'include',
                headers: myHeaders,
            })
        }
    }
})