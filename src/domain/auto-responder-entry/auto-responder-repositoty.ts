import {OnMemoryRepository} from "typescript-dddbase";
import {AutoResponderEntryIdentity} from "./auto-responder-entry-identity";
import {AutoResponderEntryBaseEntity} from "./auto-responder-entry-base-entity";
import {ClientRequestUrl} from "../client-request/value-objects/client-request-url";
import {LocalFileResponderEntity} from "../local-file-responder/local-file-responder-entity";

export class AutoResponderRepository extends OnMemoryRepository<AutoResponderEntryIdentity, AutoResponderEntryBaseEntity> {
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
}
