import { createPinia } from 'pinia'
import {useLoanRequest} from "./loan-request-store";
import {useMainStore} from "./auth-store";
import {useLoanProduct} from "./loan-product-store"
import {useMember} from "./member-store"
import {useLoan} from "./loan-store";
import {useZohoStore} from "./zoho-integration-store";
import {useClientStore} from "./client-settings-store";

export const pinia = createPinia();

export default {
    authStore: useMainStore(pinia),
    loanRequestStore: useLoanRequest(pinia),
    loanProductStore: useLoanProduct(pinia),
    memberStore: useMember(pinia),
    loanStore: useLoan(pinia),
    zohoStore: useZohoStore(pinia),
    clientStore: useClientStore(pinia),
}