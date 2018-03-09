import { BaseValueObject } from "../../../../base/value-objects/base-value-object";

export class RewriteRuleModifierHeader extends BaseValueObject<string> {
    constructor(value: string) {
        super(value.toLowerCase());
    }
}
