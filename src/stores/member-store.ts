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
}
export const useMember = defineStore('member-store', {
    state: (): MemberState => ({
        members: [],
        paginationData: null,
        memberSummary: null,
    }),
    getters: {
        getMembers(state) {
            return state.members
        },
        getPaginationData(state) {
            return state.paginationData
        },
    },
    actions: {
        async fetchMembers(params?: string) {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/members${params ? params : ''}`, {
                    method: 'GET',
                    credentials: 'include'
                });
                if (response.status === 200) {
                    const {list, total} = await response.json();
                    this.members = list;
                    this.paginationData = {
                        totalPages: total/10, // TODO: check query param and remove 10
                        totalElements: total,
                    };
                    return Promise.resolve(list);
                } else {
                    return Promise.reject(`${response.status}: Failed to fetch members.`);
                }
            } catch (e: any) {
                console.error("fetchMembers",  e);
                return Promise.reject(e.message);
            }
        },
        async fetchMembersSummary(params?: string) {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/members/summary${params ? params : ''}`, {
                    method: 'GET',
                    credentials: 'include'
                });
                if (response.status === 200) {
                    const content = await response.json();
                    this.memberSummary = content;
                    return Promise.resolve(content);
                } else {
                    return Promise.reject(`${response.status}: Failed to fetch member summary.`);
                }
            } catch (e: any) {
                console.error("fetchMembersSummary",  e);
                return Promise.reject(e.message);
            }
        }
    }
})