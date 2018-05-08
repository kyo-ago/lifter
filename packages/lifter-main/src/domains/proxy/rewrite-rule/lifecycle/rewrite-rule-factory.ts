import {
    CreateRewriteRuleDeleteModifierEntityJSON,
    CreateRewriteRuleModifierEntityJSON,
    CreateRewriteRuleUpdateModifierEntityJSON,
    RewriteRuleActionType,
    RewriteRuleDeleteModifierEntityJSON,
    RewriteRuleEntityJSON,
    RewriteRuleModifierEntityJSON,
    RewriteRuleModifierMapJSON,
    RewriteRuleUpdateModifierEntityJSON,
} from "@lifter/lifter-common";
import { injectable } from "inversify";
import { AsyncNedbIdGenerator } from "../../../base/async-nedb-id-generator";
import { ProjectEntity } from "../../project/project-entity";
import { RewriteRuleEntity } from "../rewrite-rule-entity";
import { RewriteRuleIdentity } from "../rewrite-rule-identity";
import { RewriteRuleDeleteModifierEntity } from "../rewrite-rule-modifier/rewrite-rule-delete-modifier-entity";
import { RewriteRuleModifierEntity } from "../rewrite-rule-modifier/rewrite-rule-modifier-entity";
import { RewriteRuleModifierIdentity } from "../rewrite-rule-modifier/rewrite-rule-modifier-identity";
import { RewriteRuleUpdateModifierEntity } from "../rewrite-rule-modifier/rewrite-rule-update-modifier-entity";
import { RewriteRuleModifierHeader } from "../rewrite-rule-modifier/value-objects/rewrite-rule-modifier-header";
import { RewriteRuleModifierValue } from "../rewrite-rule-modifier/value-objects/rewrite-rule-modifier-value";
import { RewriteRuleModifierMap } from "../value-objects/rewrite-rule-modifier-map";
import { RewriteRuleUrlPattern } from "../value-objects/rewrite-rule-url-pattern";

export function stringToRewriteRuleActionType(
    action: string,
): RewriteRuleActionType {
    if (action === "UPDATE") {
        return action;
    }
    if (action === "DELETE") {
        return action;
    }
    throw new Error(`Invalid action type "${action}"`);
}

type MatchCase = {
    [key in RewriteRuleActionType]: (
        modifier:
            | RewriteRuleModifierEntityJSON
            | CreateRewriteRuleModifierEntityJSON,
    ) => RewriteRuleModifierEntity
};

function SwitchTypeArray(
    modifier: RewriteRuleModifierMapJSON,
    matchCase: MatchCase,
) {
    return Object.keys(modifier).reduce(
        (base, cur) => {
            base[cur] = modifier[cur].map(modifier => matchCase[cur](modifier));
            return base;
        },
        <any>{},
    );
}

function SwitchType(
    action: RewriteRuleActionType,
    param: CreateRewriteRuleModifierEntityJSON,
    matchCase: MatchCase,
) {
    return matchCase[action](param);
}

@injectable()
export class RewriteRuleFactory extends AsyncNedbIdGenerator {
    constructor(projectEntity: ProjectEntity) {
        super(projectEntity.getDataStoreOptions(RewriteRuleFactory.name));
    }

    static fromJSON(json: RewriteRuleEntityJSON): RewriteRuleEntity {
        return new RewriteRuleEntity(
            new RewriteRuleIdentity(json.id),
            new RewriteRuleUrlPattern(json.url),
            new RewriteRuleModifierMap(
                SwitchTypeArray(json.modifier, {
                    UPDATE: (modifier: RewriteRuleUpdateModifierEntityJSON) =>
                        RewriteRuleFactory.createUpdateModifier(
                            modifier.id,
                            modifier.header,
                            modifier.value,
                        ),
                    DELETE: (modifier: RewriteRuleDeleteModifierEntityJSON) =>
                        RewriteRuleFactory.createDeleteModifier(
                            modifier.id,
                            modifier.header,
                        ),
                }),
            ),
        );
    }

    create(url: string): RewriteRuleEntity {
        let id = this.getNextIdNumber();
        return new RewriteRuleEntity(
            new RewriteRuleIdentity(id),
            new RewriteRuleUrlPattern(url),
            new RewriteRuleModifierMap({
                UPDATE: [],
                DELETE: [],
            }),
        );
    }

    createModifier(
        action: RewriteRuleActionType,
        param: CreateRewriteRuleModifierEntityJSON,
    ): RewriteRuleModifierEntity {
        let id = this.getNextIdNumber();
        return SwitchType(action, param, {
            UPDATE: (modifier: CreateRewriteRuleUpdateModifierEntityJSON) =>
                RewriteRuleFactory.createUpdateModifier(
                    id,
                    modifier.header,
                    modifier.value,
                ),
            DELETE: (modifier: CreateRewriteRuleDeleteModifierEntityJSON) =>
                RewriteRuleFactory.createDeleteModifier(id, modifier.header),
        });
    }

    static createUpdateModifier(id: number, header: string, value: string) {
        return new RewriteRuleUpdateModifierEntity(
            new RewriteRuleModifierIdentity(id),
            new RewriteRuleModifierHeader(header),
            new RewriteRuleModifierValue(value),
        );
    }

    static createDeleteModifier(id: number, header: string) {
        return new RewriteRuleDeleteModifierEntity(
            new RewriteRuleModifierIdentity(id),
            new RewriteRuleModifierHeader(header),
        );
    }
}
