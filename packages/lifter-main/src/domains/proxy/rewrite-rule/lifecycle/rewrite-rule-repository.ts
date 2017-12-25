import { AsyncOnNedbRepository } from "../../../base/async-on-nedb-repository";
import { ClientRequestEntity } from "../../client-request/client-request-entity";
import { ProjectEntity } from "../../project/project-entity";
import { RewriteRuleEntity } from "../rewrite-rule-entity";
import { RewriteRuleIdentity } from "../rewrite-rule-identity";
import { RewriteRuleFactory } from "./rewrite-rule-factory";

export class RewriteRuleRepository extends AsyncOnNedbRepository<RewriteRuleIdentity, RewriteRuleEntity> {
    constructor(projectEntity: ProjectEntity) {
        super(projectEntity.getDataStoreOptions("rewriteRuleRepository"), {
            toEntity: (json: any): RewriteRuleEntity => {
                return RewriteRuleFactory.fromJSON(json);
            },
            toJSON: (entity: RewriteRuleEntity): any => {
                return entity.json;
            }
        });
    }

    async findMatchRules(clientRequestEntity: ClientRequestEntity): Promise<RewriteRuleEntity[]> {
        let entities = await this.resolveAll();
        return entities.filter((rewriteRuleEntity: RewriteRuleEntity) => {
            rewriteRuleEntity.isMatchClientRequest(clientRequestEntity);
        });
    }
}
