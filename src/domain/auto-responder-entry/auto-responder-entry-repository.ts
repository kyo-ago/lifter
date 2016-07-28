import {Url} from "url";
import {OnMemoryRepository} from "typescript-dddbase";
import {AutoResponderEntryIdentity} from "./auto-responder-entry-identity";
import {AutoResponderEntryEntity} from "./auto-responder-entry-entity";
import {AutoResponderEntryFactory} from "./auto-responder-entry-factory";
import {LocalFileResponderEntity} from "../local-file-responder/local-file-responder-entity";
import {ClientRequestPathname} from "../client-request/client-request-pathname";

export class AutoResponderEntryRepository extends OnMemoryRepository<AutoResponderEntryIdentity, AutoResponderEntryEntity> {
    storeFilesList(files: File[]) {
        files.map((file) => this.store(AutoResponderEntryFactory.createFile(file)));
    }
    findMatchEntry(url: Url): Promise<LocalFileResponderEntity | null> {
        Object.keys(this.entities).find((key) => {
            let entity = this.entities[key];
            entity.getMatchResponder(new ClientRequestPathname(url));
        });
    }
}