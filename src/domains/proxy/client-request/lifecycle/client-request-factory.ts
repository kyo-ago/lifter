import {ClientRequestEntity, ClientRequestEntityJSON} from '../client-request-entity';
import {ClientRequestIdentity} from '../client-request-identity';
import {ClientRequestUrl} from '../value-objects/client-request-url';

export class ClientRequestFactory {
    private identity = 0;

    static fromJSON(clientRequestEntityJSON: ClientRequestEntityJSON) {
        return new ClientRequestEntity(
            new ClientRequestIdentity(clientRequestEntityJSON.id),
            new ClientRequestUrl(clientRequestEntityJSON.url),
        );
    }

    create(href: string): ClientRequestEntity {
        return new ClientRequestEntity(
            new ClientRequestIdentity(this.identity++),
            new ClientRequestUrl(href),
        );
    }
}
