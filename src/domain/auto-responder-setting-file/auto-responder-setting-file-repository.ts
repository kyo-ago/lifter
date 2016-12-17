import * as Rx from "@reactivex/rxjs/dist/cjs/Rx"
import {OnMemoryRepository} from "typescript-dddbase";
import {AutoResponderEntryIdentity} from "./auto-responder-setting-file-identity";
import {AutoResponderEntryEntity} from "./auto-responder-setting-file-entity";
import {AutoResponderEntryFactory} from "./auto-responder-setting-file-factory";
import {LocalFileResponderEntity} from "../local-file-responder/local-file-responder-entity";
import {ClientRequestUrl} from "../client-request/value-objects/client-request-url";
import {AutoResponderBoxEntry} from "../../ui/components/auto-responder-box";

export class AutoResponderEntryRepository extends OnMemoryRepository<AutoResponderEntryIdentity, AutoResponderEntryEntity> {
    public observer: Rx.Observable<AutoResponderBoxEntry>;
    private subject: Rx.Subject<AutoResponderBoxEntry>;

    constructor() {
        super();
        this.subject = new Rx.Subject<AutoResponderBoxEntry>();
        this.observer = this.subject.asObservable();
    }

    storeFilesList(files: File[]) {
        files
            .map((file) => this.store(AutoResponderEntryFactory.createFromFile(file)))
            .forEach((entity) => {
                let entry = {
                    id: entity.id,
                    pattern: entity.pattern,
                    path: entity.path,
                    type: entity.type,
                };
                this.subject.next(entry);
            })
        ;
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
