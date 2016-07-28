import {OnMemoryRepository} from "typescript-dddbase";
import {LocalFileResponderIdentity} from "./local-file-responder-identity";
import {LocalFileResponderEntity} from "./local-file-responder-entity";
import {LocalFileResponderFactory} from "./local-file-responder-factory";

export class LocalFileResponderRepository extends OnMemoryRepository<LocalFileResponderIdentity, LocalFileResponderEntity> {
    storeFilesList() {
        this.store(LocalFileResponderFactory.createFile());
    }
}