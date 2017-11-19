import { BaseEntity } from "../../share/base/base-entity";
import { ClientRequestIdentity } from "./client-request-identity";
import { ClientRequestUrl } from "./value-objects/client-request-url";

export interface ClientRequestEntityJSON {
    id: number;
    href: string;
}

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
