import {defineStore} from "pinia";
type settingsType = {
    refId:string,
    created:string,
    createdBy:string,
    updated:string,
    updatedBy:string,
    isActive:boolean,
    id:number,
    ussdShortCode:string,
    organizationName:string,
    lastModified:string
}
interface ClientStore {
    clientSettings: null | settingsType
}
export const useClientStore = defineStore('client-settings-store', {
    state: (): ClientStore => ({
        clientSettings: null
    }),
    getters: {
        getClientSettings(state) {
            return state.clientSettings
        }
    },
    actions: {
        async fetchClientSettings(): Promise<any> {
            try {
                const dat = await fetch(`${import.meta.env.VITE_API_URL}/clientSettings`, {
                    method: 'GET',
                    credentials: 'include'
                })
                if (dat.status === 200) {
                    const { response } = await dat.json()
                    this.clientSettings = response
                    return Promise.resolve()
                } else {
                    return Promise.reject(`${dat.status}: Failed to fetch client settings`)
                }
            } catch (e: any) {
                return Promise.reject(e.message)
            }
        },
        async postClientSettings(payload: {
            organizationName: string,
            ussdShortCode: string
        }): Promise<any> {
            try {
                const myHeaders = new Headers();
                myHeaders.append("Content-Type", `application/json`);
                const response = await fetch(`${import.meta.env.VITE_API_URL}/clientSettings`, {
                    method: 'POST',
                    headers: myHeaders,
                    credentials: 'include',
                    body: JSON.stringify(payload)
                })
                if (response.status === 200 || response.status === 201) {
                    return Promise.resolve(response.json())
                } else {
                    return Promise.reject(`${response.status}: Failed to post client settings`)
                }
            } catch (e: any) {
                return Promise.reject(e.message)
            }
        }
    }
})