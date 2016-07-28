import {OnMemoryRepository} from "typescript-dddbase";
import {AutoResponderEntryIdentity} from "./auto-responder-entry-identity";
import {AutoResponderEntryEntity} from "./auto-responder-entry-entity";
import {AutoResponderEntryFactory} from "./auto-responder-entry-factory";
import {LocalFileResponderEntity} from "../local-file-responder/local-file-responder-entity";

const NodeUrl = require('url');

export class AutoResponderEntryRepository extends OnMemoryRepository<AutoResponderEntryIdentity, AutoResponderEntryEntity> {
    storeFilesList(files: File[]) {
        files.map((file) => this.store(AutoResponderEntryFactory.createFile(file)));
    }
    findMatchEntry(path: string): Promise<LocalFileResponderEntity> {
        let url = NodeUrl.parse(path);
        url.pathname
        Object.keys(this.entities).find((key) => {
            let entity = this.entities[key];
            entity.matchPathname(url.pathname);
        });
    }
}