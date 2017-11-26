"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_entity_1 = require("../../base/base-entity");
class ProxyBypassDomainEntity extends base_entity_1.BaseEntity {
    constructor(identity, _name) {
        super(identity);
        this._name = _name;
    }
    get name() {
        return this._name.value;
    }
    get json() {
        return {
            id: this.id,
            name: this.name
        };
    }
}
exports.ProxyBypassDomainEntity = ProxyBypassDomainEntity;
