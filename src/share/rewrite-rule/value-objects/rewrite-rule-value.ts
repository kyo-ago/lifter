import {BaseValueObject} from "../../domain/base/value-object";

export class RewriteRuleValue extends BaseValueObject<string> {
    constructor(
        _value: string,
    ) {
        super(_value);
    }
}
