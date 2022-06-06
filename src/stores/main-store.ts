import { defineStore } from 'pinia'

interface MainState {
    isLoggedIn: boolean,
    user: any,
    notification: {
        message: string | null,
        success: boolean,
        warning: boolean,
        error: boolean,
    }
}

export const useMainStore = defineStore('main', {
    state: (): MainState => ({
        isLoggedIn: false,
        user: null,
        notification: {
            message: null,
            success: false,
            warning: false,
            error: false,
        },
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
        }
    },
    actions: {
        initialize(): Promise<any> {
            return new Promise((resolve, reject) => {
                fetch(`${import.meta.env.VITE_APP_AUTHENTICATE}`).then((response: Response) => {
                    resolve(response);
                }).catch((error: any) => {
                    reject(error);
                })
            })
        },
        setAuthState(response: Response): void {
            if (response.ok) {
                this.user = response.json();
                this.isLoggedIn = true;
            }
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
})
