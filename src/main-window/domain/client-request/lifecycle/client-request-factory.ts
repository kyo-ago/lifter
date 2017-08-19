import {ClientRequestIdentity} from "../client-request-identity";
import {ClientRequestEntity} from "../client-request-entity";
import {ClientRequestUrl} from "../value-objects/client-request-url";

export class ClientRequestFactory {
    private identity = 0;

    create(href: string): ClientRequestEntity {
        return new ClientRequestEntity(
            new ClientRequestIdentity(this.identity++),
            new ClientRequestUrl(href),
        );
    }
}