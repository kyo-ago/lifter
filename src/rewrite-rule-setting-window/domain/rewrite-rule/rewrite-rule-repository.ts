import {ShareRewriteRuleIdentity} from '../../../share/domain/share-rewrite-rule/share-rewrite-rule-identity';
import {ShareRewriteRuleRepository} from '../../../share/domain/share-rewrite-rule/share-rewrite-rule-repository';
import {RewriteRuleEntity} from './rewrite-rule-entity';

export class RewriteRuleRepository extends ShareRewriteRuleRepository<ShareRewriteRuleIdentity, RewriteRuleEntity> {
    resolveSelectedRewriteRule(): RewriteRuleEntity {
        return Object.values(this.entities).find((entity) => entity.selected);
    }
}
