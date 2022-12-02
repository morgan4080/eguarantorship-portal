import { defineStore } from 'pinia';
// https://eguarantorship-api.presta.co.ke/api/v1/loan-request/summary
interface NotificationType {
    message: string,
    success: boolean,
    warning: boolean,
    error: boolean,
}
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
    notification: NotificationType[],
    loading: boolean,
    dialogue: {title: string, isOpen: boolean}
}

export const useMainStore = defineStore('auth-store', {
    state: (): MainState => ({
        isLoggedIn: false,
        user: null,
        notification: [],
        loading: false,
        dialogue: {
            title: '',
            isOpen: false
        }
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
        },
        getDialogue(state) {
            return state.dialogue
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
        defineNotification(payload: NotificationType) {
            this.notification.push(payload)
            setTimeout(() => {
                this.notification = []
            }, 50000)
        },
        setDialogue(payload: {title: string, isOpen: boolean}) {
            this.dialogue = payload
        }
    }
});