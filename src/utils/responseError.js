export default class ResponseError extends Error {
    response;
    constructor(message, res) {
        super(message);
        this.response = res;
    }
}
//# sourceMappingURL=responseError.js.map