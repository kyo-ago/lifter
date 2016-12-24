import {AutoResponderEntryIdentity} from "./auto-responder-entry-identity";
import {AutoResponderEntryEntity} from "./auto-responder-entry-entity";
import {AutoResponderEntryPattern} from "./value-objects/auto-responder-entry-pattern";
import {AutoResponderEntryPath} from "./value-objects/auto-responder-entry-path";
import {AutoResponderEntryType} from "./value-objects/auto-responder-entry-type";

export interface AutoResponderEntryParam {
    name: string;
    path: string;
    type: string;
}

export class AutoResponderEntryFactory {
    private static identity = 0;

    static create(param: AutoResponderEntryParam): AutoResponderEntryEntity {
        return new AutoResponderEntryEntity(
            new AutoResponderEntryIdentity(this.identity++),
            new AutoResponderEntryPattern(param.name),
            new AutoResponderEntryPath(param.path),
            new AutoResponderEntryType(param.type),
        );
    }

    static createFromFile(file: File): AutoResponderEntryEntity {
        return new AutoResponderEntryEntity(
            new AutoResponderEntryIdentity(this.identity++),
            new AutoResponderEntryPattern(file.name),
            new AutoResponderEntryPath(file.path),
            new AutoResponderEntryType(file.type),
        );
    }
}