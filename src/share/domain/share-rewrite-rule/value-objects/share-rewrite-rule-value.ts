import {BaseValueObject} from '../../base/value-objects/base-value-object';

export class ShareRewriteRuleValue extends BaseValueObject<string> {
    constructor(
        _value: string,
    ) {
        super(_value);
    }
}
