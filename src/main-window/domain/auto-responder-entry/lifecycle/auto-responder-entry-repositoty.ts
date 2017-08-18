import {ResolveAllOnMemoryRepository} from "../../../../share/domain/base/lifecycle/resolve-all-on-memory-repository";
import {ClientRequestUrl} from "../../client-request/value-objects/client-request-url";
import {LocalFileResponderFactory} from "../../local-file-responder/lifecycle/local-file-responder-factory";
import {LocalFileResponderEntity} from "../../local-file-responder/local-file-responder-entity";
import {AbstractAutoResponderEntryEntity} from "../auto-responder-entry-entity";
import {AutoResponderEntryIdentity} from "../auto-responder-entry-identity";
import {FindMatchEntry} from "../specs/find-match-entry";

export class AutoResponderEntryRepository extends ResolveAllOnMemoryRepository<AutoResponderEntryIdentity, AbstractAutoResponderEntryEntity> {
    constructor(
        private localFileResponderFactory: LocalFileResponderFactory,
    ) {
        super();
    }

    findMatchEntry(clientRequestUrl: ClientRequestUrl): Promise<LocalFileResponderEntity | null> {
        let findMatchEntry = new FindMatchEntry(this.localFileResponderFactory, clientRequestUrl);
        return this.resolveAll().reduce((promise, entity) => {
            return findMatchEntry.reduce(entity, promise);
        }, Promise.resolve(<LocalFileResponderEntity | null>null));
    }
}
