import { OnMemoryRepository } from "typescript-dddbase";
import { ClientRequestEntity } from "../client-request-entity";
import { ClientRequestIdentity } from "../client-request-identity";
export declare class ClientRequestRepository extends OnMemoryRepository<ClientRequestIdentity, ClientRequestEntity> {
    resolveAll(): ClientRequestEntity[];
}
