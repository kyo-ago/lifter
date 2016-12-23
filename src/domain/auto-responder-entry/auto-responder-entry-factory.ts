import {AutoResponderEntryIdentity} from "./auto-responder-entry-identity";
import {AutoResponderEntryEntity} from "./auto-responder-entry-entity";
import {AutoResponderEntryPattern} from "./value-objects/auto-responder-entry-pattern";
import {AutoResponderEntryPath} from "./value-objects/auto-responder-entry-path";
import {AutoResponderEntryType} from "./value-objects/auto-responder-entry-type";

export class AutoResponderEntryFactory {
    private static identity = 0;

    static createFromFile(file: File): AutoResponderEntryEntity {
        let path = file.path;
        return new AutoResponderEntryEntity(
            new AutoResponderEntryIdentity(this.identity++),
            new AutoResponderEntryPattern(file.name),
            new AutoResponderEntryPath(path),
            new AutoResponderEntryType(file.type),
        );
    }
}