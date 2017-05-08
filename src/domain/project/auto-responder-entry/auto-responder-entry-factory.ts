import {AutoResponderEntryIdentity} from "./auto-responder-entry-identity";
import {AutoResponderEntryInterface, AutoResponderEntryType} from "./auto-responder-entry-interface";
import {AutoResponderEntryFileEntity} from "./auto-responder-entry-file-entity";
import {AutoResponderEntryPattern} from "./value-objects/auto-responder-entry-pattern";
import {AutoResponderEntryPath} from "./value-objects/auto-responder-entry-path";
import {AutoResponderEntryDirectoryEntity} from "./auto-responder-entry-directory-entity";
import {AutoResponderEntryGlobEntity} from "./auto-responder-entry-glob-entity";

export class AutoResponderEntryFactory {
    private static identity = 0;

    static create(type: AutoResponderEntryType, pattern: string, path: string): AutoResponderEntryInterface {
        if (type === "File") {
            return new AutoResponderEntryFileEntity(
                new AutoResponderEntryIdentity(this.identity++),
                new AutoResponderEntryPattern(pattern),
                new AutoResponderEntryPath(path),
            );
        } else if (type === "Directory") {
            return new AutoResponderEntryDirectoryEntity(
                new AutoResponderEntryIdentity(this.identity++),
                new AutoResponderEntryPattern(pattern),
                new AutoResponderEntryPath(path),
            );
        } else if (type === "Glob") {
            return new AutoResponderEntryGlobEntity(
                new AutoResponderEntryIdentity(this.identity++),
                new AutoResponderEntryPattern(pattern),
                new AutoResponderEntryPath(path),
            );
        } else {
            throw new Error(`Invalid type, type = "${type}"`);
        }
    }
}