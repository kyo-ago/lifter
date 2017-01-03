import {AutoResponderEntryBasePattern} from "../base/value-objects/auto-responder-entry-base-pattern";
import {AutoResponderEntryBasePath} from "../base/value-objects/auto-responder-entry-base-path";
import {AutoResponderEntryBaseType} from "../base/value-objects/auto-responder-entry-base-type";
import {AutoResponderEntryDirectoryIdentity} from "./auto-responder-entry-directory-identity";
import {AutoResponderEntryDirectoryEntity} from "./auto-responder-entry-directory-entity";

export interface AutoResponderEntryDirectoryParam {
    id?: number;
    pattern: string;
    path: string;
}

export class AutoResponderEntryDirectoryFactory {
    private static identity = 0;

    static create(param: AutoResponderEntryDirectoryParam): AutoResponderEntryDirectoryEntity {
        return new AutoResponderEntryDirectoryEntity(
            new AutoResponderEntryDirectoryIdentity(param.id || ++this.identity),
            new AutoResponderEntryBasePattern(param.pattern),
            new AutoResponderEntryBasePath(param.path),
            new AutoResponderEntryBaseType("Directory"),
        );
    }

    static createFromFile(file: File, identity = ++this.identity): AutoResponderEntryDirectoryEntity {
        return this.create({
            id: identity,
            pattern: file.name,
            path: file.path,
        });
    }
}