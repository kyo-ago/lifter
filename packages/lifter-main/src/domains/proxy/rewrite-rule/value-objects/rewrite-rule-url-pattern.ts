import * as micromatch from "micromatch";
import { BaseValueObject } from "../../../base/value-objects/base-value-object";

export class RewriteRuleUrlPattern extends BaseValueObject<string> {
    isMatchUrl(pathSearch: string): boolean {
        return micromatch.isMatch(pathSearch, this.value, {
            matchBase: true,
        });
    }
}
