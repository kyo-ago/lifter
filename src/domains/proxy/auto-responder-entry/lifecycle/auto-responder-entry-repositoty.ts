import * as Datastore from 'nedb';
import {AsyncOnNedbRepository} from "../../base/async-on-nedb-repository";
import {ClientRequestEntity} from '../../client-request/client-request-entity';
import {LocalFileResponderFactory} from '../../local-file-responder/lifecycle/local-file-responder-factory';
import {LocalFileResponderEntity} from '../../local-file-responder/local-file-responder-entity';
import {AbstractAutoResponderEntryEntity} from '../auto-responder-entry-entity';
import {AutoResponderEntryIdentity} from '../auto-responder-entry-identity';
import {FindMatchEntry} from '../specs/find-match-entry';
import {AutoResponderEntryFactory} from "./auto-responder-entry-factory";

export class AutoResponderEntryRepository extends AsyncOnNedbRepository<AutoResponderEntryIdentity, AbstractAutoResponderEntryEntity> {
    constructor(
        datastore: Datastore,
        private localFileResponderFactory: LocalFileResponderFactory,
    ) {
        super(datastore, {
            toEntity: (json: any): AbstractAutoResponderEntryEntity => {
                return AutoResponderEntryFactory.fromJSON(json);
            },
            toJSON: (entity: AbstractAutoResponderEntryEntity): any => {
                return entity.json;
            },
        });
    }

    async findMatchEntry(clientRequestEntity: ClientRequestEntity): Promise<LocalFileResponderEntity | null> {
        let findMatchEntry = new FindMatchEntry(this.localFileResponderFactory, clientRequestEntity);
        let entries = await this.resolveAll();
        return entries.reduce((promise, entity) => {
            return findMatchEntry.reduce(entity, promise);
        }, Promise.resolve(<LocalFileResponderEntity | null>null));
    }
}
