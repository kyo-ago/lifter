import {AutoResponderEntryIdentity} from "./auto-responder-entry-identity";
import {AutoResponderEntryEntity} from "./auto-responder-entry-entity";
import {AutoResponderEntryPattern} from "./auto-responder-entry-pattern";
import {AutoResponderEntryPath} from "./auto-responder-entry-path";

interface InFile extends File {
    path: string;
}

export class AutoResponderEntryFactory {
    private static identity = 0;
    static createFile(file: File): AutoResponderEntryEntity {
        let path = (<InFile>file).path;
        return new AutoResponderEntryEntity(
            new AutoResponderEntryIdentity(this.identity++),
            new AutoResponderEntryPattern(path),
            new AutoResponderEntryPath(path),
        );
    }
}