import {ResolveAllOnMemoryRepository} from "../../../share/base/lifecycle/resolve-all-on-memory-repository";
import {ShareRewriteRuleIdentity} from '../../../share/share-rewrite-rule/share-rewrite-rule-identity';
import {RewriteRuleEntity} from '../rewrite-rule-entity';

export class RewriteRuleRepository extends ResolveAllOnMemoryRepository<ShareRewriteRuleIdentity, RewriteRuleEntity> {
    resolveSelectedRewriteRule(): RewriteRuleEntity {
        return Object.values(this.entities).find((entity) => entity.selected);
    }
}
