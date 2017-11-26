import { BaseValueObject } from "../../../base/value-objects/base-value-object";
export declare type Types = "ADD" | "MODIFY" | "DELETE";
export declare class RewriteRuleAction extends BaseValueObject<Types> {
    constructor(_value: string);
}
