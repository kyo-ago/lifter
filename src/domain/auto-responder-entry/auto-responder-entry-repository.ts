import {OnMemoryRepository} from "typescript-dddbase";
import {AutoResponderEntryIdentity} from "./auto-responder-entry-identity";
import {AutoResponderEntryEntity} from "./auto-responder-entry-entity";
import {AutoResponderEntryFactory} from "./auto-responder-entry-factory";
import {LocalFileResponderEntity} from "../local-file-responder/local-file-responder-entity";
import {ClientRequestUrl} from "../client-request/client-request-url";
import {AutoResponderBoxEntry} from "../../ui/components/auto-responder-box";

export class AutoResponderEntryRepository extends OnMemoryRepository<AutoResponderEntryIdentity, AutoResponderEntryEntity> {
    storeFilesList(files: File[]) {
        files.map((file) => this.store(AutoResponderEntryFactory.createFromFile(file)));
    }
    findMatchEntry(clientRequestPathname: ClientRequestUrl): Promise<LocalFileResponderEntity | null> {
        return Object.keys(this.entities).reduce((promise, key) => {
            let entity = this.entities[key];
            return promise.then((result) => {
                return result || entity.getMatchResponder(clientRequestPathname);
            });
        }, Promise.resolve(null));
    }
    getFilesList(): Promise<AutoResponderBoxEntry[]> {
        return new Promise((resolve) => {
            let sortedValues = Object.keys(this.entities)
                .map(_ => Number(_))
                .sort()
                .map(_ => this.entities[_])
            ;
            let entries = sortedValues.reduce((base: AutoResponderBoxEntry[], entity: AutoResponderEntryEntity) => {
                base.push({
                    id: entity.id,
                    pattern: entity.pattern,
                    path: entity.path,
                    type: entity.type,
                });
                return base;
            }, <AutoResponderBoxEntry[]>[]);
            resolve(entries);
        });
    }
}
