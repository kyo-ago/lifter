import {ShareRewriteRuleEntity} from './share-rewrite-rule-entity';
import {ShareRewriteRuleIdentity} from './share-rewrite-rule-identity';
import {ShareRewriteRuleAction} from './value-objects/share-rewrite-rule-action';
import {ShareRewriteRuleHeader} from './value-objects/share-rewrite-rule-header';
import {ShareRewriteRuleValue} from './value-objects/share-rewrite-rule-value';

export class ShareRewriteRuleFactory<Entity extends ShareRewriteRuleEntity> {
    private static identity = 0;

    static create(
        action: string,
        header: string,
        value: string,
    ): Entity {
        return new Entity(
            new ShareRewriteRuleIdentity(this.identity++),
            new ShareRewriteRuleAction(action),
            new ShareRewriteRuleHeader(header),
            new ShareRewriteRuleValue(value),
        );
    }

    static toJSON(entities: Entity[]): any {
        entities
    }

    static fromJSON(json: any): void {

    }
}
