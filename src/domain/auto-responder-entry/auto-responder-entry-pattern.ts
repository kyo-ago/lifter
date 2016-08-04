import {ClientRequestPathname} from "../client-request/client-request-pathname";
export class AutoResponderEntryPattern {
    private regExp: RegExp;

    constructor(
        private value: string
    ) {
        this.regExp = new RegExp(`/${this.value}(/|$)`);
    }

    isMatch(path: ClientRequestPathname) {
        return this.regExp.test(path.getValue());
    }

    get value() {
        return this.value;
    }
}