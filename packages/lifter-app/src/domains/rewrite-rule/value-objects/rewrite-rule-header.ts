import {BaseValueObject} from "../../base/value-objects/base-value-object";

export class RewriteRuleHeader extends BaseValueObject<string> {
    constructor(value: string) {
        super(value.toLowerCase());
    }
}
