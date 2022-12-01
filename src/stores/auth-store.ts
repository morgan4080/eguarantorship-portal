import { defineStore } from 'pinia';
// https://eguarantorship-api.presta.co.ke/api/v1/loan-request/summary

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
    }
});