import { injectable } from "inversify";
import { AsyncOnNedbRepository } from "../../../base/async-on-nedb-repository";
import { ProjectEntity } from "../../project/project-entity";
import { RewriteRuleEntity } from "../rewrite-rule-entity";
import { RewriteRuleIdentity } from "../rewrite-rule-identity";
import { RewriteRuleFactory } from "./rewrite-rule-factory";

@injectable()
export class RewriteRuleRepository extends AsyncOnNedbRepository<RewriteRuleIdentity, RewriteRuleEntity> {
    constructor(projectEntity: ProjectEntity) {
        super(projectEntity.getDataStoreOptions(RewriteRuleRepository.name), {
            toEntity: (json: any): RewriteRuleEntity => {
                return RewriteRuleFactory.fromJSON(json);
            },
            toJSON: (entity: RewriteRuleEntity): any => {
                return entity.json;
            },
        });
    }
}
