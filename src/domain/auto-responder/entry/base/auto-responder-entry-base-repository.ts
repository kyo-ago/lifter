import * as Rx from "@reactivex/rxjs/dist/cjs/Rx";
import * as Datastore from "nedb";

import {AsyncOnNedbRepository} from "../../../base/async-on-nedb-repository";
import {AutoResponderEntryBaseIdentity} from "./auto-responder-entry-base-identity";
import {AutoResponderEntryBaseEntity} from "./auto-responder-entry-base-entity";
import {AutoResponderEntryBaseFactory} from "./auto-responder-entry-base-factory";
import {AutoResponderBoxEntry} from "../../../../ui/components/auto-responder-box";
import {LocalFileResponderEntity} from "../../../local-file-responder/local-file-responder-entity";
import {ClientRequestUrl} from "../../../client-request/value-objects/client-request-url";

export class AutoResponderEntryBaseRepository extends AsyncOnNedbRepository<AutoResponderEntryBaseIdentity, AutoResponderEntryBaseEntity> {
    public observer: Rx.Observable<AutoResponderBoxEntry>;
    private subject: Rx.Subject<AutoResponderBoxEntry>;

    constructor(datastore: Datastore) {
        super(datastore, {
            toEntity(json: any): AutoResponderEntryBaseEntity {
                return AutoResponderEntryBaseFactory.create({
                    id: parseInt(json['id'], 10),
                    pattern: json['pattern'],
                    path: json['path'],
                    type: json['type'],
                });
            },
            toJSON(entity: AutoResponderEntryBaseEntity): Object {
                return {
                    id: entity.id,
                    pattern: entity.pattern,
                    path: entity.path,
                    type: entity.type,
                };
            },
        });
        this.subject = new Rx.Subject<AutoResponderBoxEntry>();
        this.observer = this.subject.asObservable();
    }

    store(entity: AutoResponderEntryBaseEntity): Promise<AutoResponderEntryBaseEntity> {
        return super.store(entity).then(() => {
            let entry = {
                id: entity.id,
                pattern: entity.pattern,
                path: entity.path,
                type: entity.type,
            };
            this.subject.next(entry);
        });
    }

    storeFile(file: File) {
        AutoResponderEntryBaseFactory.createFromFile(file).then((entity) => {
            this.store(entity);
        });
    }

    findMatchEntry(clientRequestPathname: ClientRequestUrl): Promise<LocalFileResponderEntity | null> {
        return this.findAll().then((entities) => {
            return entities.reduce((promise, entity) => {
                return promise.then((result) => {
                    return result || entity.getMatchResponder(clientRequestPathname);
                });
            }, Promise.resolve(null));
        });
    }
}
