"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_entity_1 = require("../../base/base-entity");
class RewriteRuleEntity extends base_entity_1.BaseEntity {
    constructor(identity, _url, _action, _header, _value) {
        super(identity);
        this._url = _url;
        this._action = _action;
        this._header = _header;
        this._value = _value;
    }
    get url() {
        return this._url.value;
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
    get json() {
        return {
            id: this.id,
            url: this.url,
            action: this.action,
            header: this.header,
            value: this.value
        };
    }
    isMatchClientRequest(clientRequestEntity) {
        return this._url.isMatchUrl(clientRequestEntity.href);
    }
    applyHeader(header) {
        if (this.action === "ADD") {
            header[this.header] = header[this.header] ? [].concat(header[this.header], this.value) : this.value;
        } else if (this.action === "MODIFY") {
            header[this.header] = this.value;
        } else if (this.action === "DELETE") {
            delete header[this.header];
        }
        return header;
    }
}
exports.RewriteRuleEntity = RewriteRuleEntity;
