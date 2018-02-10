import * as micromatch from "micromatch";
import { BaseValueObject } from "../../../base/value-objects/base-value-object";

export class RewriteRuleUrlPattern extends BaseValueObject<string> {
    isMatchUrl(url: string): boolean {
        return micromatch.isMatch(url, this.value, {
            matchBase: true,
        });
    }
}
