import {BaseEntity} from '../base/base-entity';
import {ShareProxyBypassDomainIdentity} from './share-proxy-bypass-domain-identity';
import {ShareProxyBypassDomainName} from './vaue-objects/share-proxy-bypass-domain-name';

export interface ShareProxyBypassDomainEntityJSON {
    id: number;
    name: string;
}

export abstract class ShareProxyBypassDomainEntity extends BaseEntity<ShareProxyBypassDomainIdentity> {
    constructor(
        identity: ShareProxyBypassDomainIdentity,
        private _name: ShareProxyBypassDomainName,
    ) {
        super(identity);
    }

    get name(): string {
        return this._name.value;
    }

    get json(): ShareProxyBypassDomainEntityJSON {
        return {
            id: this.id,
            name: this.name,
        };
    }
}
