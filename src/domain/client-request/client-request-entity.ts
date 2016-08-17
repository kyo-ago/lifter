import {Entity} from "typescript-dddbase";
import {ClientRequestIdentity} from "./client-request-identity";
import {ClientRequestUrl} from "./client-request-url";

export class ClientRequestEntity extends Entity<ClientRequestIdentity> {
    constructor(
        identity: ClientRequestIdentity,
        url: ClientRequestUrl,
    ) {
        super(identity);
    }

    get id() {
        return this.getIdentity().getValue();
    }
}