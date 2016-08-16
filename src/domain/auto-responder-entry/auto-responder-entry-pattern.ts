import {ClientRequestUrl} from "../client-request/client-request-url";
export class AutoResponderEntryPattern {
    private regExp: RegExp;

    constructor(
        private _value: string
    ) {
        this.regExp = new RegExp(`/${this._value}(/|$)`);
    }

    isMatch(path: ClientRequestUrl) {
        return this.regExp.test(path.getPathname());
    }

    get value() {
        return this._value;
    }
}