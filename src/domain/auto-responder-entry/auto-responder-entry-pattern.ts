import {ClientRequestPathname} from "../client-request/client-request-pathname";
export class AutoResponderEntryPattern {
    private regExp: RegExp;

    constructor(
        private _value: string
    ) {
        this.regExp = new RegExp(`/${this._value}(/|$)`);
    }

    isMatch(path: ClientRequestPathname) {
        return this.regExp.test(path.getValue());
    }

    get value() {
        return this._value;
    }
}