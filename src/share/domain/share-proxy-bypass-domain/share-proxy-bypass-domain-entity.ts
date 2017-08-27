import {BaseEntity} from "../../../share/domain/base/base-entity";
import {ShareProxyBypassDomainIdentity} from "./share-proxy-bypass-domain-identity";
import {ShareProxyBypassDomainPattern} from "./vaue-objects/share-proxy-bypass-domain-pattern";

export interface ShareProxyBypassDomainEntityJSON {
    id: number;
    pattern: string;
}

export abstract class ShareProxyBypassDomainEntity extends BaseEntity<ShareProxyBypassDomainIdentity> {
    constructor(
        identity: ShareProxyBypassDomainIdentity,
        private pattern: ShareProxyBypassDomainPattern,
    ) {
        super(identity);
    }
}
