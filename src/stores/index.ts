import { createPinia } from 'pinia'
import {useLoanRequest} from "./loan-request-store";
import {useMainStore} from "./auth-store";

export const pinia = createPinia();

export default {
    authStore: useMainStore(pinia),
    useLoanRequest: useLoanRequest(pinia)
}