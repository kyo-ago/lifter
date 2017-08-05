import {LocalFileResponderEntity} from "../../local-file-responder/local-file-responder-entity";
import {ClientRequestUrl} from "../../client-request/value-objects/client-request-url";
import {AutoResponderEntryEntity} from "../auto-responder-entry-entity";
import {LocalFileResponderFactory} from "../../local-file-responder/lifecycle/local-file-responder-factory";

export class FindMatchEntry {
    constructor(
        private localFileResponderFactory: LocalFileResponderFactory,
        private clientRequestPathname: ClientRequestUrl,
    ) { }

    reduce(
        entity: AutoResponderEntryEntity,
        promise: Promise<LocalFileResponderEntity | null>,
    ) {
        return promise.then((result) => {
            if (result) {
                return result;
            }

            return entity.getMatchResponder(this.clientRequestPathname).then((localFileResponderParam) => {
                if (!localFileResponderParam) {
                    return null;
                }
                return this.localFileResponderFactory.create(localFileResponderParam);
            });
        });
    }
}
