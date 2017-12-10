import { BaseValueObject } from "@kyo-ago/lifter-common";

export class RewriteRuleHeader extends BaseValueObject<string> {
    constructor(value: string) {
        super(value.toLowerCase());
    }
}
