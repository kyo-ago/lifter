import { injectable } from "inversify";
import { OnMemoryRepository } from "typescript-dddbase";
import { ResolveAll } from "../../../libs/resolve-all";
import { ClientRequestEntity } from "../client-request-entity";
import { ClientRequestIdentity } from "../client-request-identity";

@injectable()
export class ClientRequestRepository extends OnMemoryRepository<
    ClientRequestIdentity,
    ClientRequestEntity
> {
    resolveAll(): ClientRequestEntity[] {
        return ResolveAll(this.entities);
    }
}
