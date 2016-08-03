import {OnMemoryRepository} from "typescript-dddbase";
import {AutoResponderEntryIdentity} from "./auto-responder-entry-identity";
import {AutoResponderEntryEntity} from "./auto-responder-entry-entity";
import {AutoResponderEntryFactory} from "./auto-responder-entry-factory";
import {LocalFileResponderEntity} from "../local-file-responder/local-file-responder-entity";
import {ClientRequestPathname} from "../client-request/client-request-pathname";
import {AutoResponderBoxProps, AutoResponderBoxEntry} from "../../ui/auto-responder-box";

export class AutoResponderEntryRepository extends OnMemoryRepository<AutoResponderEntryIdentity, AutoResponderEntryEntity> {
    storeFilesList(files: File[]) {
        files.map((file) => this.store(AutoResponderEntryFactory.createFile(file)));
    }
    findMatchEntry(path: string): Promise<LocalFileResponderEntity | null> {
        return Object.keys(this.entities).reduce((promise, key) => {
            let entity = this.entities[key];
            return promise.then((result) => {
                return result || entity.getMatchResponder(new ClientRequestPathname(path));
            });
        }, Promise.resolve(null));
    }
    getFilesList(): Promise<AutoResponderBoxEntry[]> {
        return new Promise(() => {

        });
    }
}