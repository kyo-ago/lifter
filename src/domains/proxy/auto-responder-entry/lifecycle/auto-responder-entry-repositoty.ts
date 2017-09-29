import {OnMemoryRepository} from "typescript-dddbase";
import {ResolveAll} from "../../../libs/resolve-all";
import {ClientRequestEntity} from '../../client-request/client-request-entity';
import {LocalFileResponderFactory} from '../../local-file-responder/lifecycle/local-file-responder-factory';
import {LocalFileResponderEntity} from '../../local-file-responder/local-file-responder-entity';
import {AbstractAutoResponderEntryEntity} from '../auto-responder-entry-entity';
import {AutoResponderEntryIdentity} from '../auto-responder-entry-identity';
import {FindMatchEntry} from '../specs/find-match-entry';

export class AutoResponderEntryRepository extends OnMemoryRepository<AutoResponderEntryIdentity, AbstractAutoResponderEntryEntity> {
    constructor(
        private localFileResponderFactory: LocalFileResponderFactory,
    ) {
        super();
    }

    findMatchEntry(clientRequestEntity: ClientRequestEntity): Promise<LocalFileResponderEntity | null> {
        let findMatchEntry = new FindMatchEntry(this.localFileResponderFactory, clientRequestEntity);
        return this.resolveAll().reduce((promise, entity) => {
            return findMatchEntry.reduce(entity, promise);
        }, Promise.resolve(<LocalFileResponderEntity | null>null));
    }

    resolveAll(): AbstractAutoResponderEntryEntity[] {
        return ResolveAll(this.entities);
    }
}
