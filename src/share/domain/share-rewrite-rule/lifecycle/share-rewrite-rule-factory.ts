import {ShareRewriteRuleEntity, ShareRewriteRuleEntityJSON} from '../share-rewrite-rule-entity';
import {ShareRewriteRuleIdentity} from '../share-rewrite-rule-identity';
import {ShareRewriteRuleAction} from '../value-objects/share-rewrite-rule-action';
import {ShareRewriteRuleHeader} from '../value-objects/share-rewrite-rule-header';
import {ShareRewriteRuleValue} from '../value-objects/share-rewrite-rule-value';

export abstract class ShareRewriteRuleFactory<Entity extends ShareRewriteRuleEntity> {
    protected identity = 0;

    abstract create(
        action: string,
        header: string,
        value: string,
    ): Entity;

    abstract fromJSON(json: ShareRewriteRuleEntityJSON): Entity;
}
