import {OnMemoryRepository} from "typescript-dddbase";
import {ClientRequestIdentity} from "./client-request-identity";
import {ClientRequestEntity} from "./client-request-entity";

export class ClientRequestRepository extends OnMemoryRepository<ClientRequestIdentity, ClientRequestEntity> {
    resolveAll(): ClientRequestEntity[] {
        return Object.keys(this.entities)
            .map((key) => Number(key))
            .sort((a, b) => a - b)
            .map((key) => this.entities[String(key)])
        ;
    }
}
