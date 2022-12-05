declare module "vue/types/vue" {
    interface Vue {
        $filters: {
            currencyKES: (money: number) => string
        }
    }
}