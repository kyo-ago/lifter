import * as Datastore from 'nedb';
import {ShareRewriteRuleIdentity} from '../../../share/share-rewrite-rule/share-rewrite-rule-identity';
import {AsyncOnNedbRepository} from "../../base/async-on-nedb-repository";
import {ClientRequestEntity} from '../../client-request/client-request-entity';
import {RewriteRuleEntity} from '../rewrite-rule-entity';
import {RewriteRuleFactory} from "./rewrite-rule-factory";

export class RewriteRuleRepository extends AsyncOnNedbRepository<ShareRewriteRuleIdentity, RewriteRuleEntity> {
    constructor(datastore: Datastore) {
        super(datastore, {
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
            rewriteRuleEntity.isMatchClientRequest(clientRequestEntity)
        });
    }
}
