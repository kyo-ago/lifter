import {BaseEntity} from "../base/base-entity";
import {ClientRequestIdentity} from "./client-request-identity";
import {ClientRequestUrl} from "./value-objects/client-request-url";

export class ClientRequestEntity extends BaseEntity<ClientRequestIdentity> {
    constructor(
        identity: ClientRequestIdentity,
        private _url: ClientRequestUrl,
    ) {
        super(identity);
    }

    get url() {
        return this._url.value;
    }
}