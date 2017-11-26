"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const proxy_bypass_domain_entity_1 = require("../proxy-bypass-domain-entity");
const proxy_bypass_domain_identity_1 = require("../proxy-bypass-domain-identity");
const proxy_bypass_domain_name_1 = require("../vaue-objects/proxy-bypass-domain-name");
class ProxyBypassDomainFactory {
    static fromJSON(json) {
        return new proxy_bypass_domain_entity_1.ProxyBypassDomainEntity(
            new proxy_bypass_domain_identity_1.ProxyBypassDomainIdentity(json.id),
            new proxy_bypass_domain_name_1.ProxyBypassDomainName(json.pattern)
        );
    }
}
exports.ProxyBypassDomainFactory = ProxyBypassDomainFactory;
