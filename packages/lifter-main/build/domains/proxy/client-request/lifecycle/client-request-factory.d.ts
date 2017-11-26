/// <reference types="node" />
import { Url } from "url";
import { ClientRequestEntity, ClientRequestEntityJSON } from "../client-request-entity";
export declare class ClientRequestFactory {
    private identity;
    static fromJSON(clientRequestEntityJSON: ClientRequestEntityJSON): ClientRequestEntity;
    create(url: Url): ClientRequestEntity;
    createFromString(href: string): ClientRequestEntity;
}
