import {BaseValueObject} from '../../base/value-objects/base-value-object';

export class ShareRewriteRuleHeader extends BaseValueObject<string> {
    constructor(
        _value: string,
    ) {
        super(_value);
    }
}
