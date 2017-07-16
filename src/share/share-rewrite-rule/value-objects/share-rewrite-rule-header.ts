import {BaseValueObject} from "../../domain/base/value-object";

export class ShareRewriteRuleHeader extends BaseValueObject<string> {
    constructor(
        _value: string,
    ) {
        super(_value);
    }
}
