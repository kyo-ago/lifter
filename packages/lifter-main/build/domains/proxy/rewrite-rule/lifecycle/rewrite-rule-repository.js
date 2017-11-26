"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const async_on_nedb_repository_1 = require("../../../base/async-on-nedb-repository");
const rewrite_rule_factory_1 = require("./rewrite-rule-factory");
class RewriteRuleRepository extends async_on_nedb_repository_1.AsyncOnNedbRepository {
    constructor(projectEntity) {
        super(projectEntity.getDataStoreOptions("rewriteRuleRepository"), {
            toEntity: json => {
                return rewrite_rule_factory_1.RewriteRuleFactory.fromJSON(json);
            },
            toJSON: entity => {
                return entity.json;
            }
        });
    }
    async findMatchRules(clientRequestEntity) {
        let entities = await this.resolveAll();
        return entities.filter(rewriteRuleEntity => {
            rewriteRuleEntity.isMatchClientRequest(clientRequestEntity);
        });
    }
}
exports.RewriteRuleRepository = RewriteRuleRepository;
