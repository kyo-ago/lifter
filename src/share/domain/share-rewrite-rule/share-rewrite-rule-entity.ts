import {BaseEntity} from '../base/base-entity';
import {ShareRewriteRuleIdentity} from './share-rewrite-rule-identity';
import {ShareRewriteRuleAction} from './value-objects/share-rewrite-rule-action';
import {ShareRewriteRuleHeader} from './value-objects/share-rewrite-rule-header';
import {ShareRewriteRuleValue} from './value-objects/share-rewrite-rule-value';

export class ShareRewriteRuleEntity extends BaseEntity<ShareRewriteRuleIdentity> {
    constructor(
        identity: ShareRewriteRuleIdentity,
        private _action: ShareRewriteRuleAction,
        private _header: ShareRewriteRuleHeader,
        private _value: ShareRewriteRuleValue,
    ) {
        super(identity);
    }

    get action() {
        return this._action.value;
    }

    get header() {
        return this._header.value;
    }

    get value() {
        return this._value.value;
    }
}
