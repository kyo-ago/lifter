import {OnMemoryRepository} from "typescript-dddbase";
import {ClientRequestIdentity} from "./client-request-identity";
import {ClientRequestEntity} from "./client-request-entity";
import {ClientRequestUrl} from "./value-objects/client-request-url";
import {ClientRequestFactory} from "./client-request-factory";

export class ClientRequestRepository extends OnMemoryRepository<ClientRequestIdentity, ClientRequestEntity> {
    storeRequest(clientRequestUrl: ClientRequestUrl) {
        let entity = ClientRequestFactory.create(clientRequestUrl);
        this.store(entity);
    }
}
