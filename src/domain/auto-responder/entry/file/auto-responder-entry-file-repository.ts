import * as Rx from "@reactivex/rxjs/dist/cjs/Rx";
import * as Datastore from "nedb";

import {AsyncOnNedbRepository} from "../../../base/async-on-nedb-repository";
import {AutoResponderEntryFileIdentity} from "./auto-responder-entry-file-identity";
import {AutoResponderEntryFileEntity} from "./auto-responder-entry-file-entity";
import {AutoResponderEntryFileFactory} from "./auto-responder-entry-file-factory";
import {AutoResponderBoxEntry} from "../../../../ui/components/auto-responder-box";
import {LocalFileResponderEntity} from "../../../local-file-responder/local-file-responder-entity";
import {ClientRequestUrl} from "../../../client-request/value-objects/client-request-url";

export class AutoResponderEntryFileRepository extends AsyncOnNedbRepository<AutoResponderEntryFileIdentity, AutoResponderEntryFileEntity> {
    public observer: Rx.Observable<AutoResponderBoxEntry>;
    private subject: Rx.Subject<AutoResponderBoxEntry>;

    constructor(datastore: Datastore) {
        super(datastore, {
            toEntity(json: any): AutoResponderEntryFileEntity {
                return AutoResponderEntryFileFactory.create({
                    id: parseInt(json['id'], 10),
                    pattern: json['pattern'],
                    path: json['path'],
                    type: json['type'],
                });
            },
            toJSON(entity: AutoResponderEntryFileEntity): Object {
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

    store(entity: AutoResponderEntryFileEntity): Promise<AutoResponderEntryFileEntity> {
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
        AutoResponderEntryFileFactory.createFromFile(file).then((entity) => {
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
