import { ClientRequestEntity } from "../../client-request/client-request-entity";
import { LocalFileResponderFactory } from "../../local-file-responder/lifecycle/local-file-responder-factory";
import { LocalFileResponderEntity } from "../../local-file-responder/local-file-responder-entity";
import { AbstractAutoResponderEntryEntity } from "../auto-responder-entry-entity";

export class FindMatchEntry {
    constructor(
        private localFileResponderFactory: LocalFileResponderFactory,
        private clientRequestEntity: ClientRequestEntity
    ) {}

    async getLocalFileResponder(
        promise: Promise<LocalFileResponderEntity | null>,
        entity: AbstractAutoResponderEntryEntity
    ): Promise<LocalFileResponderEntity | null> {
        let result = await promise;
        if (result) return result;

        let localFileResponderParam = await entity.getMatchResponder(this.clientRequestEntity);
        if (!localFileResponderParam) {
            return null;
        }

        return this.localFileResponderFactory.create(localFileResponderParam);
    }
}
