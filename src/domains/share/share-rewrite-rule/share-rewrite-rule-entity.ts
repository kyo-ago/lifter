import {BaseEntity} from '../base/base-entity';
import {ShareRewriteRuleIdentity} from './share-rewrite-rule-identity';
import {ACTION, ShareRewriteRuleAction} from './value-objects/share-rewrite-rule-action';
import {ShareRewriteRuleHeader} from './value-objects/share-rewrite-rule-header';
import {ShareRewriteRuleUrlPattern} from './value-objects/share-rewrite-rule-url-pattern';
import {ShareRewriteRuleValue} from './value-objects/share-rewrite-rule-value';

export interface ShareRewriteRuleEntityJSON {
    id: number;
    url: string;
    action: string;
    header: string;
    value: string;
}

export abstract class ShareRewriteRuleEntity extends BaseEntity<ShareRewriteRuleIdentity> {
    constructor(
        identity: ShareRewriteRuleIdentity,
        private _url: ShareRewriteRuleUrlPattern,
        private _action: ShareRewriteRuleAction,
        private _header: ShareRewriteRuleHeader,
        private _value: ShareRewriteRuleValue,
    ) {
        super(identity);
    }

    get url(): string {
        return this._url.value;
    }

    get action(): ACTION {
        return this._action.value;
    }

    get header(): string {
        return this._header.value;
    }

    get value(): string {
        return this._value.value;
    }

    get json(): ShareRewriteRuleEntityJSON {
        return {
            id: this.id,
            url: this.url,
            action: this.action,
            header: this.header,
            value: this.value,
        };
    }

    protected isMatchUrl(url: string): boolean {
        return this._url.isMatchUrl(url);
    }
}
