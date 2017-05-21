import {OnMemoryRepository} from "typescript-dddbase";
import {AutoResponderEntryIdentity} from "./auto-responder-entry-identity";
import {ClientRequestUrl} from "../client-request/value-objects/client-request-url";
import {LocalFileResponderEntity} from "../local-file-responder/local-file-responder-entity";
import {AutoResponderEntryInterface} from "./auto-responder-entry-interface";

export class AutoResponderEntryRepository extends OnMemoryRepository<AutoResponderEntryIdentity, AutoResponderEntryInterface> {
    findMatchEntry(clientRequestPathname: ClientRequestUrl): Promise<LocalFileResponderEntity | null> {
        return new Promise((resolve, reject) => {
            return Object.keys(this.entities).reduce((promise, key) => {
                let entity = this.entities[key];
                return promise.then((result) => {
                    return result || (<any>entity).getMatchResponder(clientRequestPathname);
                });
            }, <Promise<LocalFileResponderEntity | null>>Promise.resolve(null));
        });
    }

    getEntities(): AutoResponderEntryInterface[] {
        return Object.keys(this.entities)
            .map((key) => Number(key))
            .sort((a, b) => a - b)
            .map((key) => this.entities[String(key)])
        ;
    }
}
