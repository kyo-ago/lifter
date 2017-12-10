import { BaseValueObject } from "@kyo-ago/lifter-common";
import * as micromatch from "micromatch";

export class RewriteRuleUrlPattern extends BaseValueObject<string> {
    isMatchUrl(url: string): boolean {
        return micromatch.isMatch(url, this.value, {
            matchBase: true
        });
    }
}
