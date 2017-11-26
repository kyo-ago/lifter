import { BaseValueObject } from "../../../base/value-objects/base-value-object";
export declare class RewriteRuleUrlPattern extends BaseValueObject<string> {
    isMatchUrl(url: string): boolean;
}
