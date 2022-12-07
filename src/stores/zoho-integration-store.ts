import {defineStore} from "pinia";

type zohoType = {
    refId: string,
    created:string,
    createdBy:string,
    isActive:boolean,
    id:number,
    clientId:string,
    clientSecret:string,
    code:string,
    refreshToken:string,
    lastModified:string
}

type zohoTemplate = {
    owner_id: string,
    template_name: string,
    template_id: string
}

type zohoTemplateDetails = {
    role: string,
    action_id: string,
    action_type: string,
    recipient_name: string,
    recipient_phonenumber: string,
    is_embedded: boolean,
    recipient_email: string,
    private_notes: string,
    verify_recipient: boolean
}
interface ZohoStoreState {
    zoho: null | zohoType
    templates: zohoTemplate[]
    templateDetails: zohoTemplateDetails[]
}
export const useZohoStore = defineStore('zoho-integration-store',  {
    state: (): ZohoStoreState => ({
        zoho: null,
        templates: [],
        templateDetails: []
    }),
    getters: {
        getZohoDetails (state) {
            return state.zoho
        },
        getZohoTemplates (state) {
            return state.templates
        },
        getZohoTemplateDetails (state) {
            return state.templateDetails
        }
    },
    actions: {
        async fetchTemplateDetails(templateId: string): Promise<any> {
            try {
                const dat = await fetch(`${import.meta.env.VITE_API_URL}/zoho/template-details?templateId=${templateId}`, {
                    method: 'GET',
                    credentials: 'include'
                })
                if (dat.status === 200) {
                    const {response} = await dat.json()
                    this.templateDetails = response
                    return Promise.resolve(response.json())
                } else {
                    return Promise.reject(`${dat.status}: Failed to fetch template details`)
                }
            } catch (e: any) {
                return Promise.reject(e.message)
            }
        },
        async fetchLoanProductTemplates(): Promise<any> {
            try {
                const dat = await fetch(`${import.meta.env.VITE_API_URL}/zoho/templates`, {
                    method: 'GET',
                    credentials: 'include'
                })
                if (dat.status === 200) {
                    const {response} = await dat.json()
                    this.templates = response
                    return Promise.resolve(response.json())
                } else {
                    return Promise.reject(`${dat.status}: Failed to fetch zoho templates`)
                }
            } catch (e: any) {
                return Promise.reject(e.message)
            }
        },
        async fetchZohoCredentials () {
            try {
                const dat = await fetch(`${import.meta.env.VITE_API_URL}/zoho`, {
                    method: 'GET',
                    credentials: 'include'
                })

                if (dat.status === 200) {
                    const { response } = await dat.json()
                    this.zoho = response
                } else {
                    return Promise.reject(`${dat.status}: Failed to fetch zoho credentials.`)
                }
            } catch (e: any) {
                console.error("fetchZohoCredentials",  e.message)
                return Promise.reject(e)
            }
        },
        async submitCredentials (payload: {
            clientId: string,
            clientSecret: string,
            code: string,
            refreshToken: string
        }) {
            try {
                const myHeaders = new Headers()
                myHeaders.append("Content-Type", `application/json`)
                const response = await fetch(`${import.meta.env.VITE_API_URL}/zoho`, {
                    method: 'POST',
                    credentials: 'include',
                    headers: myHeaders,
                    body: JSON.stringify(payload)
                })
                if (response.status === 200) {
                    const data = await response.json()
                    console.log(`${response.status}`, data)
                    return Promise.resolve(data)
                } else {
                    console.error(`${response.status}: Failed to submit zoho credentials.`)
                    return Promise.reject(`${response.status}: Failed to submit zoho credentials.`)
                }
            } catch (e: any) {
                console.error("submitCredentials",  e.message)
                return Promise.reject(e.message)
            }
        }
    }
})