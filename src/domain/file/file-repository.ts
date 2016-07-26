import {OnMemoryRepository} from "typescript-dddbase";
import {FileIdentity} from "./file-identity";
import {FileEntity} from "./file-entity";

export class FileRepository extends OnMemoryRepository<FileIdentity, FileEntity> {
}