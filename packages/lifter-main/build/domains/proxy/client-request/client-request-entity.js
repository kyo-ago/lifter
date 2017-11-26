"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_entity_1 = require("../../base/base-entity");
class ClientRequestEntity extends base_entity_1.BaseEntity {
    constructor(identity, _url) {
        super(identity);
        this._url = _url;
    }
    get href() {
        return this._url.getHref();
    }
    get pathname() {
        return this._url.getPathname();
    }
    get json() {
        return {
            id: this.id,
            href: this._url.getHref()
        };
    }
}
exports.ClientRequestEntity = ClientRequestEntity;
