"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const async_on_nedb_repository_1 = require("../../../base/async-on-nedb-repository");
const proxy_bypass_domain_factory_1 = require("./proxy-bypass-domain-factory");
class ProxyBypassDomainRepository extends async_on_nedb_repository_1.AsyncOnNedbRepository {
    constructor(projectEntity) {
        super(projectEntity.getDataStoreOptions("proxyBypassDomainRepository"), {
            toEntity: json => {
                return proxy_bypass_domain_factory_1.ProxyBypassDomainFactory.fromJSON(json);
            },
            toJSON: entity => {
                return entity.json;
            }
        });
    }
}
exports.ProxyBypassDomainRepository = ProxyBypassDomainRepository;
