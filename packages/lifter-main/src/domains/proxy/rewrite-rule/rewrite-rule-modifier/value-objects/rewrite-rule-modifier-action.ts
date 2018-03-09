import {
    RewriteRuleActionType,
    RewriteRuleDeleteModifierEntityJSON,
    RewriteRuleModifierEntityJSON,
    RewriteRuleUpdateModifierEntityJSON,
} from "@lifter/lifter-common";
import { BaseValueObject } from "../../../../base/value-objects/base-value-object";
import { RewriteRuleDeleteModifierEntity } from "../rewrite-rule-delete-modifier-entity";
import { RewriteRuleUpdateModifierEntity } from "../rewrite-rule-update-modifier-entity";

const StringToType = (value: string): RewriteRuleActionType => {
    if (value === "UPDATE") {
        return value;
    } else if (value === "DELETE") {
        return value;
    }
    throw new Error("Invalid RewriteRuleActionType");
};

export interface MatchCase {
    ["UPDATE"]: (modifier: RewriteRuleUpdateModifierEntityJSON) => RewriteRuleUpdateModifierEntity;
    ["DELETE"]: (modifier: RewriteRuleDeleteModifierEntityJSON) => RewriteRuleDeleteModifierEntity;
}

export function SwitchType(modifier: RewriteRuleModifierEntityJSON, matchCase: MatchCase) {
    if (modifier.action === "UPDATE") {
        return matchCase["UPDATE"](<RewriteRuleUpdateModifierEntityJSON>modifier);
    } else if (modifier.action === "DELETE") {
        return matchCase["DELETE"](<RewriteRuleDeleteModifierEntityJSON>modifier);
    }
    throw new Error("Invalid RewriteRuleActionType");
}

export class RewriteRuleModifierAction extends BaseValueObject<RewriteRuleActionType> {
    constructor(_value: string) {
        super(StringToType(_value));
    }
}
