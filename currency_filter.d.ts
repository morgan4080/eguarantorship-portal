export {}

declare module 'vue' {
    interface ComponentCustomProperties {
        $filters: {
            currencyKES: (money: number) => string
        }
    }
}