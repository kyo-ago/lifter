import {ShareRewriteRuleEntity} from "../../../share/share-rewrite-rule/share-rewrite-rule-entity";
import {ShareRewriteRuleIdentity} from "../../../share/share-rewrite-rule/share-rewrite-rule-identity";
import {ShareRewriteRuleAction} from "../../../share/share-rewrite-rule/value-objects/share-rewrite-rule-action";
import {ShareRewriteRuleHeader} from "../../../share/share-rewrite-rule/value-objects/share-rewrite-rule-header";
import {ShareRewriteRuleValue} from "../../../share/share-rewrite-rule/value-objects/share-rewrite-rule-value";

export class RewriteRuleEntity extends ShareRewriteRuleEntity {
    public selected: boolean = false;

    constructor(
        identity: ShareRewriteRuleIdentity,
        private _action: ShareRewriteRuleAction,
        private _header: ShareRewriteRuleHeader,
        private _value: ShareRewriteRuleValue,
    ) {
        super(identity, _action, _header, _value);
        this.selected = false;
    }

    select() {
        this.selected = true;
    }

    deselect() {
        this.selected = false;
    }
}
