import * as Rx from "@reactivex/rxjs/dist/cjs/Rx";

import {OnMemoryRepository} from "typescript-dddbase";
import {AutoResponderEntryIdentity} from "./auto-responder-entry-identity";
import {AutoResponderEntryEntity} from "./auto-responder-entry-entity";
import {AutoResponderEntryFactory} from "./auto-responder-entry-factory";
import {AutoResponderBoxEntry} from "../../ui/components/auto-responder-box";
import {LocalFileResponderEntity} from "../local-file-responder/local-file-responder-entity";
import {ClientRequestUrl} from "../client-request/value-objects/client-request-url";

export class AutoResponderEntryRepository extends OnMemoryRepository<AutoResponderEntryIdentity, AutoResponderEntryEntity> {
    public observer: Rx.Observable<AutoResponderBoxEntry>;
    private subject: Rx.Subject<AutoResponderBoxEntry>;

    constructor() {
        super();
        this.subject = new Rx.Subject<AutoResponderBoxEntry>();
        this.observer = this.subject.asObservable();
    }

    store(entity: AutoResponderEntryEntity) {
        super.store(entity);
        let entry = {
            id: entity.id,
            pattern: entity.pattern,
            path: entity.path,
            type: entity.type,
        };
        this.subject.next(entry);
        return entity;
    }

    storeFile(file: File) {
        AutoResponderEntryFactory.createFromFile(file).then((entity) => {
            this.store(entity);
        });
    }

    findMatchEntry(clientRequestPathname: ClientRequestUrl): Promise<LocalFileResponderEntity | null> {
        return Object.keys(this.entities).reduce((promise, key) => {
            let entity = this.entities[key];
            return promise.then((result) => {
                return result || entity.getMatchResponder(clientRequestPathname);
            });
        }, Promise.resolve(null));
    }
}
