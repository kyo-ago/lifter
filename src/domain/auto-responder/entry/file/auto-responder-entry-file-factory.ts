import {AutoResponderEntryBasePattern} from "../base/value-objects/auto-responder-entry-base-pattern";
import {AutoResponderEntryBasePath} from "../base/value-objects/auto-responder-entry-base-path";
import {AutoResponderEntryBaseType} from "../base/value-objects/auto-responder-entry-base-type";
import {AutoResponderEntryFileEntity} from "./auto-responder-entry-file-entity";
import {AutoResponderEntryFileIdentity} from "./auto-responder-entry-file-identity";

export interface AutoResponderEntryFileParam {
    id?: number;
    pattern: string;
    path: string;
}

export class AutoResponderEntryFileFactory {
    private static identity = 0;

    static create(param: AutoResponderEntryFileParam): AutoResponderEntryFileEntity {
        return new AutoResponderEntryFileEntity(
            new AutoResponderEntryFileIdentity(param.id || ++this.identity),
            new AutoResponderEntryBasePattern(param.pattern),
            new AutoResponderEntryBasePath(param.path),
            new AutoResponderEntryBaseType("File"),
        );
    }

    static createFromFile(file: File, identity = ++this.identity): AutoResponderEntryFileEntity {
        return this.create({
            id: identity,
            pattern: file.name,
            path: file.path,
        });
    }
}