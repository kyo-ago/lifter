import {Entity} from "typescript-dddbase";
import {FileIdentity} from "./file-identity";
import {FileName} from "./file-name";
import {FilePath} from "./file-path";
import {FileType} from "./file-type";

export class FileEntity extends Entity<FileIdentity> {
    constructor(
        identity: FileIdentity,
        public name: FileName,
        public path: FilePath,
        public type: FileType,
    ) {
        super(identity);
    }
}