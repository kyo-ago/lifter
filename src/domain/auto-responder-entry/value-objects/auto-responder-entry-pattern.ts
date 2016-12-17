import {ClientRequestUrl} from "../../client-request/value-objects/client-request-url";
import {BaseValueObject} from "../../base/value-object";
export class AutoResponderEntryPattern extends BaseValueObject<string> {
    private regExp: RegExp;

    constructor(
        _value: string
    ) {
        super(_value);
        this.regExp = new RegExp(`/${this._value}(/|$)`);
    }

    isMatch(path: ClientRequestUrl) {
        return this.regExp.test(path.getPathname());
    }
}