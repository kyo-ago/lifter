import {Entity} from "typescript-dddbase";
import {ClientRequestIdentity} from "./client-request-identity";
import {ClientRequestUrl} from "./value-objects/client-request-url";

export class ClientRequestEntity extends Entity<ClientRequestIdentity> {
    constructor(
        identity: ClientRequestIdentity,
        private _url: ClientRequestUrl,
    ) {
        super(identity);
    }

    get id() {
        return this.getIdentity().getValue();
    }

    get url() {
        return this._url.value;
    }
}