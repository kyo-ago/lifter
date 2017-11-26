import { BaseEntity } from "../../base/base-entity";
import { ClientRequestIdentity } from "./client-request-identity";
import { ClientRequestUrl } from "./value-objects/client-request-url";
export interface ClientRequestEntityJSON {
    id: number;
    href: string;
}
export declare class ClientRequestEntity extends BaseEntity<ClientRequestIdentity> {
    private _url;
    constructor(identity: ClientRequestIdentity, _url: ClientRequestUrl);
    readonly href: string;
    readonly pathname: string;
    readonly json: ClientRequestEntityJSON;
}
