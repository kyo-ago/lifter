import { RewriteRuleEntityJSON } from "@lifter/lifter-common";
import { RewriteRuleEntity } from "../rewrite-rule-entity";
import { RewriteRuleIdentity } from "../rewrite-rule-identity";
import { RewriteRuleDeleteModifierEntity } from "../rewrite-rule-modifier/rewrite-rule-delete-modifier-entity";
import { RewriteRuleModifierIdentity } from "../rewrite-rule-modifier/rewrite-rule-modifier-identity";
import { RewriteRuleUpdateModifierEntity } from "../rewrite-rule-modifier/rewrite-rule-update-modifier-entity";
import { SwitchType } from "../rewrite-rule-modifier/value-objects/rewrite-rule-modifier-action";
import { RewriteRuleModifierHeader } from "../rewrite-rule-modifier/value-objects/rewrite-rule-modifier-header";
import { RewriteRuleModifierValue } from "../rewrite-rule-modifier/value-objects/rewrite-rule-modifier-value";
import { RewriteRuleUrlPattern } from "../value-objects/rewrite-rule-url-pattern";

export class RewriteRuleFactory {
    static fromJSON(json: RewriteRuleEntityJSON): RewriteRuleEntity {
        return new RewriteRuleEntity(
            new RewriteRuleIdentity(json.id),
            new RewriteRuleUrlPattern(json.url),
            json.modifiers.map(modifier => {
                return SwitchType(modifier, {
                    UPDATE: modifier =>
                        new RewriteRuleUpdateModifierEntity(
                            new RewriteRuleModifierIdentity(modifier.id),
                            new RewriteRuleModifierHeader(modifier.header),
                            new RewriteRuleModifierValue(modifier.value),
                        ),
                    DELETE: modifier =>
                        new RewriteRuleDeleteModifierEntity(
                            new RewriteRuleModifierIdentity(modifier.id),
                            new RewriteRuleModifierHeader(modifier.header),
                        ),
                });
            }),
        );
    }
}
