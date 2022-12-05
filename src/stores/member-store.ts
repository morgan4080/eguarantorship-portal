import {defineStore} from "pinia";
import {PaginationData} from "./loan-request-store";
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
        memberDetails: null
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
        }
    },
    actions: {
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
                const response = await fetch(`${import.meta.env.VITE_API_URL}/members/summary${params ? params : ''}`, {
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
        async editMemberDetails(payload: Omit<MemberDetailSubmit, 'memberNumber'>, refId: string) {
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
                    this.memberDetails = {
                        "email": "",
                        "idNumber": "",
                        "isTermsAccepted": false,
                        "refId": "IyJ8lmaCsT6yANkS",
                        "created": "11/05/2022 08:39",
                        "createdBy": "39fc32a7-675e-4584-b9c7-496bfe31093c",
                        "updated": "18/10/2022 07:53",
                        "updatedBy": "39fc32a7-675e-4584-b9c7-496bfe31093c",
                        "firstName": "HERMAN",
                        "fullName": "HERMAN KIMANI CHEGE",
                        "lastName": "CHEGE",
                        "memberNumber": "33",
                        "phoneNumber": "254721578854",
                        "totalShares": 25000,
                        "totalDeposits": 15000,
                        "committedAmount": 0,
                        "availableAmount": 0,
                        "memberStatus": "ACTIVE",
                        "details": {
                            "mname": {
                                "value": "KIMANI",
                                "type": "TEXT"
                            }
                        }
                    }
                    return Promise.resolve(data)
                } else {
                    console.error(`${response.status}: Failed to fetch member details.`)
                    return Promise.reject(`${response.status}: Failed to fetch member details.`)
                }
            } catch (e: any) {
                console.error("fetchMember",  e.message)
                return Promise.reject(e.message)
            }
        }
    }
})