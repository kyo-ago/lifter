import { ProxyBypassDomainEntity } from "../../../../domains/proxy-bypass-domain/proxy-bypass-domain-entity";

export const UPDATE_PROXY_BYPASS_DOMAINS = "UPDATE_PROXY_BYPASS_DOMAINS";

export const Actions = {
    updateProxyBypassDomains: (proxyBypassDomains: ProxyBypassDomainEntity[]) => {
        return {
            type: UPDATE_PROXY_BYPASS_DOMAINS,
            proxyBypassDomains
        };
    }
};
