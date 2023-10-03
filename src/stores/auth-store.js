import { defineStore } from 'pinia';
export const useMainStore = defineStore('auth-store', {
    state: () => ({
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
            return state.isLoggedIn;
        },
        getLoggedInUser(state) {
            return state.user;
        },
        getNotification(state) {
            return state.notification;
        },
        getLoadingState(state) {
            return state.loading;
        },
        getDialogue(state) {
            return state.dialogue;
        }
    },
    actions: {
        setLoading(payload) {
            this.loading = payload;
        },
        async initialize() {
            const url = `${import.meta.env.VITE_APP_USER}`;
            try {
                const response = await fetch(url, {
                    method: 'GET',
                    credentials: 'include'
                });
                if (response.status === 200) {
                    return Promise.resolve(response.json());
                }
                else {
                    return Promise.reject(response.status);
                }
            }
            catch (e) {
                return Promise.reject(e.message);
            }
        },
        setAuthState(data) {
            this.user = data;
            this.isLoggedIn = true;
        },
        clearNotification(id) {
            this.notification = this.notification.filter(notification => notification.id !== id);
        },
        defineNotification(payload) {
            this.notification.push(payload);
            setTimeout(() => this.clearNotification(payload.id), 5000);
        },
        setDialogue(payload) {
            this.dialogue = payload;
        }
    }
});
//# sourceMappingURL=auth-store.js.map