import {BaseValueObject} from '../../base/value-object';

export class ShareRewriteRuleValue extends BaseValueObject<string> {
    constructor(
        _value: string,
    ) {
        super(_value);
    }
}
