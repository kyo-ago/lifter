import { ClientRequestEntityJSON } from "@kyo-ago/lifter-common";
import { parse, Url } from "url";
import { ClientRequestEntity } from "../client-request-entity";
import { ClientRequestIdentity } from "../client-request-identity";
import { ClientRequestUrl } from "../value-objects/client-request-url";

export class ClientRequestFactory {
    private identity = 0;

    static fromJSON(clientRequestEntityJSON: ClientRequestEntityJSON) {
        return new ClientRequestEntity(
            new ClientRequestIdentity(clientRequestEntityJSON.id),
            new ClientRequestUrl(parse(clientRequestEntityJSON.href))
        );
    }

    create(url: Url): ClientRequestEntity {
        return new ClientRequestEntity(new ClientRequestIdentity(this.identity++), new ClientRequestUrl(url));
    }

    createFromString(href: string): ClientRequestEntity {
        return new ClientRequestEntity(new ClientRequestIdentity(this.identity++), new ClientRequestUrl(parse(href)));
    }
}
