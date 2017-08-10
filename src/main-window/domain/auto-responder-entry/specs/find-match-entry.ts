import {LocalFileResponderEntity} from "../../local-file-responder/local-file-responder-entity";
import {ClientRequestUrl} from "../../client-request/value-objects/client-request-url";
import {AutoResponderEntryEntity} from "../auto-responder-entry-entity";
import {LocalFileResponderFactory} from "../../local-file-responder/lifecycle/local-file-responder-factory";

export class FindMatchEntry {
    constructor(
        private localFileResponderFactory: LocalFileResponderFactory,
        private clientRequestPathname: ClientRequestUrl,
    ) { }

    async reduce(
        entity: AutoResponderEntryEntity,
        promise: Promise<LocalFileResponderEntity | null>,
    ) {
        let result = await promise;
        if (result) {
            return result;
        }

        let localFileResponderParam = await entity.getMatchResponder(this.clientRequestPathname);
        if (!localFileResponderParam) {
            return null;
        }

        return this.localFileResponderFactory.create(localFileResponderParam);
    }
}
