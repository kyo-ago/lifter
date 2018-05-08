import { ClientRequestEntityJSON } from "@lifter/lifter-common";
import { BaseEntity } from "../../base/base-entity";
import { ClientRequestIdentity } from "./client-request-identity";
import { ClientRequestUrl } from "./value-objects/client-request-url";

export class ClientRequestEntity extends BaseEntity<ClientRequestIdentity> {
    constructor(
        identity: ClientRequestIdentity,
        private _url: ClientRequestUrl,
    ) {
        super(identity);
    }

    get href(): string {
        return this._url.getHref();
    }

    get pathname(): string {
        return this._url.getPathname();
    }

    get pathSearch(): string {
        return this._url.getPathSearch();
    }

    get json(): ClientRequestEntityJSON {
        return {
            id: this.id,
            href: this._url.getHref(),
        };
    }
}
