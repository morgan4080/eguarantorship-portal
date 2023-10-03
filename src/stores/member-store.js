import { defineStore } from "pinia";
import ResponseError from "../utils/responseError";
export const useMember = defineStore('member-store', {
    state: () => ({
        members: [],
        paginationData: null,
        memberSummary: null,
        memberDetails: null,
        memberViewData: null,
        memberHeader: []
    }),
    getters: {
        getMembers(state) {
            return state.members;
        },
        getPaginationData(state) {
            return state.paginationData;
        },
        getMemberDetails(state) {
            return state.memberDetails;
        },
        getMemberSummary(state) {
            return state.memberSummary;
        },
        getMemberViewData(state) {
            return state.memberViewData;
        },
        getMemberHeader(state) {
            return state.memberHeader;
        }
    },
    actions: {
        async initMemberTransfers(params) {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/core-banking/init-member-transfers${params ? params : ''}`, {
                    method: 'GET',
                    credentials: 'include'
                });
                if (!response.ok) {
                    throw new ResponseError('Bad fetch response', response);
                }
                const data = await response.text();
                return Promise.resolve(data);
            }
            catch (err) {
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
        async getCo_bankingMemberDetails(params) {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/core-banking/member-details${params ? params : ''}`, {
                    method: 'GET',
                    credentials: 'include'
                });
                if (response.status === 200) {
                    const content = await response.json();
                    return Promise.resolve(content);
                }
                else {
                    return Promise.reject(`${response.status}: Failed to get member.`);
                }
            }
            catch (e) {
                console.error("ge", e);
                return Promise.reject(e.message);
            }
        },
        async exportMembers(params) {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/reports/members${params ? params : ''}`, {
                    method: 'GET',
                    credentials: 'include'
                });
                if (response.status === 200) {
                    const content = await response.blob();
                    return Promise.resolve(URL.createObjectURL(content));
                }
                else {
                    return Promise.reject(`${response.status}: Failed to export members.`);
                }
            }
            catch (e) {
                console.error("exportMembers", e);
                return Promise.reject(e.message);
            }
        },
        async fetchMembers(params) {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/members${params ? params : ''}`, {
                    method: 'GET',
                    credentials: 'include'
                });
                if (response.status === 200) {
                    const { list, total } = await response.json();
                    this.members = list;
                    this.paginationData = {
                        totalPages: total / 10,
                        totalElements: total,
                    };
                    return Promise.resolve(list);
                }
                else {
                    console.error(`${response.status}: Failed to fetch members.`);
                    return Promise.reject(`${response.status}: Failed to fetch members.`);
                }
            }
            catch (e) {
                console.error("fetchMembers", e.message);
                return Promise.reject(e.message);
            }
        },
        async fetchMembersSummary(params) {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/reports/members/summary${params ? params : ''}`, {
                    method: 'GET',
                    credentials: 'include'
                });
                if (response.status === 200) {
                    const data = await response.json();
                    this.memberSummary = data;
                    return Promise.resolve(data);
                }
                else {
                    console.log(`${response.status}: Failed to fetch member summary.`);
                    return Promise.reject(`${response.status}: Failed to fetch member summary.`);
                }
            }
            catch (e) {
                console.error("fetchMembersSummary", e.message);
                return Promise.reject(e.message);
            }
        },
        async submitMemberDetails(payload) {
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
                    const data = await response.json();
                    console.log(`${response.status}`, data);
                    return Promise.resolve(data);
                }
                else {
                    console.error(`${response.status}: Failed to submit member details.`);
                    return Promise.reject(`${response.status}: Failed to submit member details.`);
                }
            }
            catch (e) {
                console.error("submitMemberDetails", e.message);
                return Promise.reject(e.message);
            }
        },
        async editMemberDetails(payload, refId) {
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
                    const data = await response.json();
                    console.log(`${response.status}`, data);
                    return Promise.resolve(data);
                }
                else {
                    console.error(`${response.status}: Failed to edit member details.`);
                    return Promise.reject(`${response.status}: Failed to edit member details.`);
                }
            }
            catch (e) {
                console.error("editMemberDetails", e.message);
                return Promise.reject(e.message);
            }
        },
        async fetchMember(refId) {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/members/${refId}`, {
                    method: 'GET',
                    credentials: 'include'
                });
                if (response.status === 200) {
                    const data = await response.json();
                    console.log(`${response.status}`, data);
                    this.memberDetails = data;
                    return Promise.resolve(data);
                }
                else {
                    console.error(`${response.status}: Failed to fetch member details.`);
                    return Promise.reject(`${response.status}: Failed to fetch member details.`);
                }
            }
            catch (e) {
                console.error("fetchMember", e.message);
                return Promise.reject(e.message);
            }
        },
        setMemberViewData(str) {
            this.memberViewData = str;
        },
        setMemberHeader(headers) {
            this.memberHeader = headers;
        },
        async importapi(data) {
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", `application/json`);
            return await fetch(`${import.meta.env.VITE_API_URL}/members`, {
                method: 'POST',
                body: JSON.stringify(data),
                credentials: 'include',
                headers: myHeaders,
            });
        }
    }
});
//# sourceMappingURL=member-store.js.map