import { injectable } from "inversify";
import { ProxyBypassDomainEntity } from "../proxy-bypass-domain-entity";
import { ProxyBypassDomainIdentity } from "../proxy-bypass-domain-identity";
import { ProxyBypassDomainName } from "../vaue-objects/proxy-bypass-domain-name";

@injectable()
export class ProxyBypassDomainFactory {
    private identity = 0;

    static fromJSON(json: any): ProxyBypassDomainEntity {
        return new ProxyBypassDomainEntity(
            new ProxyBypassDomainIdentity(json.id),
            new ProxyBypassDomainName(json.pattern),
        );
    }

    create(name: string): ProxyBypassDomainEntity {
        return new ProxyBypassDomainEntity(
            new ProxyBypassDomainIdentity(this.identity++),
            new ProxyBypassDomainName(name),
        );
    }
}
