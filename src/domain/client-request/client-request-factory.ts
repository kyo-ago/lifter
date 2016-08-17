import {ClientRequestIdentity} from "./client-request-identity";
import {ClientRequestEntity} from "./client-request-entity";
import {ClientRequestUrl} from "./client-request-url";

export class ClientRequestFactory {
    private static identity = 0;

    static create(clientRequestUrl: ClientRequestUrl): ClientRequestEntity {
        return new ClientRequestEntity(
            new ClientRequestIdentity(this.identity++),
            clientRequestUrl,
        );
    }
}