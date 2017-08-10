import {BaseEntity} from '../base/base-entity';
import {ShareRewriteRuleIdentity} from './share-rewrite-rule-identity';
import {ACTION, ShareRewriteRuleAction} from './value-objects/share-rewrite-rule-action';
import {ShareRewriteRuleHeader} from './value-objects/share-rewrite-rule-header';
import {ShareRewriteRuleValue} from './value-objects/share-rewrite-rule-value';

export interface ShareRewriteRuleEntityJSON {
    id: number;
    action: ACTION;
    header: string;
    value: string;
}

export class ShareRewriteRuleEntity extends BaseEntity<ShareRewriteRuleIdentity> {
    constructor(
        identity: ShareRewriteRuleIdentity,
        private _action: ShareRewriteRuleAction,
        private _header: ShareRewriteRuleHeader,
        private _value: ShareRewriteRuleValue,
    ) {
        super(identity);
    }

    getIdentity() {
        return this.id;
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

    get json(): ShareRewriteRuleEntityJSON {
        return {
            id: this.id,
            action: this.action,
            header: this.header,
            value: this.value,
        };
    }
}
