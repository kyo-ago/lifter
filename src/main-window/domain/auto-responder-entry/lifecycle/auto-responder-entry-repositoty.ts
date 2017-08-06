import {OnMemoryRepository} from 'typescript-dddbase';
import {ClientRequestUrl} from '../../client-request/value-objects/client-request-url';
import {LocalFileResponderEntity} from '../../local-file-responder/local-file-responder-entity';
import {AutoResponderEntryEntity} from '../auto-responder-entry-entity';
import {AutoResponderEntryIdentity} from '../auto-responder-entry-identity';
import {FindMatchEntry} from "../specs/find-match-entry";
import {LocalFileResponderFactory} from "../../local-file-responder/lifecycle/local-file-responder-factory";

export class AutoResponderEntryRepository extends OnMemoryRepository<AutoResponderEntryIdentity, AutoResponderEntryEntity> {
    constructor(
        private localFileResponderFactory: LocalFileResponderFactory,
    ) {
        super();
    }

    findMatchEntry(clientRequestPathname: ClientRequestUrl): Promise<LocalFileResponderEntity | null> {
        let findMatchEntry = new FindMatchEntry(this.localFileResponderFactory, clientRequestPathname);
        return Object.keys(this.entities).reduce((promise, key) => {
            return findMatchEntry.reduce(this.entities[key], promise);
        }, Promise.resolve(<LocalFileResponderEntity | null>null));
    }

    resolveAll(): AutoResponderEntryEntity[] {
        return Object.keys(this.entities)
            .map((key) => Number(key))
            .sort((a, b) => a - b)
            .map((key) => this.entities[String(key)])
        ;
    }
}
