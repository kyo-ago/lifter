import {ResolveAllOnMemoryRepository} from "../../../../share/domain/base/lifecycle/resolve-all-on-memory-repository";
import {ClientRequestEntity} from "../client-request-entity";
import {ClientRequestIdentity} from "../client-request-identity";

export class ClientRequestRepository extends ResolveAllOnMemoryRepository<ClientRequestIdentity, ClientRequestEntity> {
}
