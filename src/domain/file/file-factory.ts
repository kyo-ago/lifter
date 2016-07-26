import {FileIdentity} from "./file-identity";
import {FileEntity} from "./file-entity";
import {FileName} from "./file-name";
import {FilePath} from "./file-path";
import {FileType} from "./file-type";

interface InFile extends File {
    path: string;
}

export class FileFactory {
    private static identity = 0;
    static createFile(file: InFile): FileEntity {
        return new FileEntity(
            new FileIdentity(this.identity++),
            new FileName(file.name),
            new FilePath(file.path),
            new FileType(file.type),
        );
    }
}