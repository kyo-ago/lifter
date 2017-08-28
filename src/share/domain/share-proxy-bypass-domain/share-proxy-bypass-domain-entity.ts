import {BaseEntity} from '../base/base-entity';
import {ShareProxyBypassDomainIdentity} from './share-proxy-bypass-domain-identity';
import {ShareProxyBypassDomainPattern} from './vaue-objects/share-proxy-bypass-domain-pattern';

export interface ShareProxyBypassDomainEntityJSON {
    id: number;
    pattern: string;
}

export abstract class ShareProxyBypassDomainEntity extends BaseEntity<ShareProxyBypassDomainIdentity> {
    constructor(
        identity: ShareProxyBypassDomainIdentity,
        private _pattern: ShareProxyBypassDomainPattern,
    ) {
        super(identity);
    }

    get pattern(): string {
        return this._pattern.value;
    }

    get json(): ShareProxyBypassDomainEntityJSON {
        return {
            id: this.id,
            pattern: this.pattern,
        };
    }
}
