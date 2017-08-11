import {ClientRequestUrl} from "../../client-request/value-objects/client-request-url";
import {LocalFileResponderFactory} from "../../local-file-responder/lifecycle/local-file-responder-factory";
import {LocalFileResponderEntity} from "../../local-file-responder/local-file-responder-entity";
import {AbstractAutoResponderEntryEntity} from "../auto-responder-entry-entity";

export class FindMatchEntry {
    constructor(
        private localFileResponderFactory: LocalFileResponderFactory,
        private clientRequestUrl: ClientRequestUrl,
    ) { }

    async reduce(
        entity: AbstractAutoResponderEntryEntity,
        promise: Promise<LocalFileResponderEntity | null>,
    ) {
        let result = await promise;
        if (result) return result;

        let localFileResponderParam = await entity.getMatchResponder(this.clientRequestUrl);
        if (!localFileResponderParam) {
            return null;
        }

        return this.localFileResponderFactory.create(localFileResponderParam);
    }
}
