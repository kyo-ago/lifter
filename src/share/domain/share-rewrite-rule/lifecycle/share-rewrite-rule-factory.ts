import {ShareRewriteRuleEntity, ShareRewriteRuleEntityJSON} from "../share-rewrite-rule-entity";

export abstract class ShareRewriteRuleFactory<Entity extends ShareRewriteRuleEntity> {
    protected identity = 0;

    abstract create(
        url: string,
        action: string,
        header: string,
        value: string,
    ): Entity;

    abstract fromJSON(json: ShareRewriteRuleEntityJSON): Entity;
}
