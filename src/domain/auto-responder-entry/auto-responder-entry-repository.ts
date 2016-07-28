import {OnMemoryRepository} from "typescript-dddbase";
import {AutoResponderEntryIdentity} from "./auto-responder-entry-identity";
import {AutoResponderEntryEntity} from "./auto-responder-entry-entity";
import {AutoResponderEntryFactory} from "./auto-responder-entry-factory";

export class AutoResponderEntryRepository extends OnMemoryRepository<AutoResponderEntryIdentity, AutoResponderEntryEntity> {
    storeFilesList(files: File[]) {
        files.map((file) => AutoResponderEntryFactory.createFile(file));
    }
}