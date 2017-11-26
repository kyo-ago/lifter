import { ClientRequestEntity } from "../../client-request/client-request-entity";
import { LocalFileResponderFactory } from "../../local-file-responder/lifecycle/local-file-responder-factory";
import { LocalFileResponderEntity } from "../../local-file-responder/local-file-responder-entity";
import { AbstractAutoResponderEntryEntity } from "../auto-responder-entry-entity";
export declare class FindMatchEntry {
    private localFileResponderFactory;
    private clientRequestEntity;
    constructor(localFileResponderFactory: LocalFileResponderFactory, clientRequestEntity: ClientRequestEntity);
    getLocalFileResponder(
        promise: Promise<LocalFileResponderEntity | null>,
        entity: AbstractAutoResponderEntryEntity
    ): Promise<LocalFileResponderEntity | null>;
}
