import { BaseEntity, ClientRequestEntityJSON } from "@kyo-ago/lifter-common";
import { ClientRequestIdentity } from "./client-request-identity";
import { ClientRequestUrl } from "./value-objects/client-request-url";

export class ClientRequestEntity extends BaseEntity<ClientRequestIdentity> {
    constructor(identity: ClientRequestIdentity, private _url: ClientRequestUrl) {
        super(identity);
    }

    get href() {
        return this._url.getHref();
    }

    get pathname() {
        return this._url.getPathname();
    }

    get json(): ClientRequestEntityJSON {
        return {
            id: this.id,
            href: this._url.getHref()
        };
    }
}
