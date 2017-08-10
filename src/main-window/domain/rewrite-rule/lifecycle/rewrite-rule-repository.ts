import {ShareRewriteRuleEntity} from '../../../../share/domain/share-rewrite-rule/share-rewrite-rule-entity';
import {ShareRewriteRuleIdentity} from '../../../../share/domain/share-rewrite-rule/share-rewrite-rule-identity';
import {ShareRewriteRuleRepository} from '../../../../share/domain/share-rewrite-rule/lifecycle/share-rewrite-rule-repository';

export class RewriteRuleRepository extends ShareRewriteRuleRepository<ShareRewriteRuleIdentity, ShareRewriteRuleEntity> {
}
