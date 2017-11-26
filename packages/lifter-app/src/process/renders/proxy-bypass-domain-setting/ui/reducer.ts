import { ProxyBypassDomainEntity } from "../../../../domains/proxy-bypass-domain/proxy-bypass-domain-entity";
import * as AppActions from "./action";

export interface StateToProps {
    proxyBypassDomains: ProxyBypassDomainEntity[];
}

let initialState: StateToProps = {
    proxyBypassDomains: <ProxyBypassDomainEntity[]>[]
};

export function reducer(state = initialState, action: any): StateToProps {
    switch (action.type) {
        case AppActions.UPDATE_PROXY_BYPASS_DOMAINS:
            return {
                ...state,
                proxyBypassDomains: action.proxyBypassDomains
            };
        default:
            return state;
    }
}
