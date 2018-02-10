import { OnMemoryRepository } from "typescript-dddbase";
import { ResolveAll } from "../../../libs/resolve-all";
import { ProxyBypassDomainEntity } from "../proxy-bypass-domain-entity";
import { ProxyBypassDomainIdentity } from "../proxy-bypass-domain-identity";

type E = {
    [key: string]: ProxyBypassDomainEntity;
};

export class ProxyBypassDomainRepository extends OnMemoryRepository<
    ProxyBypassDomainIdentity,
    ProxyBypassDomainEntity
> {
    overwriteAll(entities: ProxyBypassDomainEntity[]) {
        this.entities = entities.reduce(
            (base: E, cur: ProxyBypassDomainEntity) => {
                base[cur.id] = cur;
                return base;
            },
            <E>{},
        );
    }

    resolveAll(): ProxyBypassDomainEntity[] {
        return ResolveAll(this.entities);
    }
}
