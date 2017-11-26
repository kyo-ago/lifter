import { AsyncOnNedbRepository } from "../../../base/async-on-nedb-repository";
import { ClientRequestEntity } from "../../client-request/client-request-entity";
import { ProjectEntity } from "../../project/project-entity";
import { RewriteRuleEntity } from "../rewrite-rule-entity";
import { RewriteRuleIdentity } from "../rewrite-rule-identity";
export declare class RewriteRuleRepository extends AsyncOnNedbRepository<RewriteRuleIdentity, RewriteRuleEntity> {
    constructor(projectEntity: ProjectEntity);
    findMatchRules(clientRequestEntity: ClientRequestEntity): Promise<RewriteRuleEntity[]>;
}
