import {AutoResponderEntryGlobEntity} from "./auto-responder-entry-glob-entity";
import {AutoResponderEntryGlobIdentity} from "./auto-responder-entry-glob-identity";
import {AutoResponderEntryBasePath} from "../base/value-objects/auto-responder-entry-base-path";
import {AutoResponderEntryBaseType} from "../base/value-objects/auto-responder-entry-base-type";
import {AutoResponderEntryGlobPattern} from "./value-objects/auto-responder-entry-glob-pattern";

export interface AutoResponderEntryGlobParam {
    id?: number;
    pattern: string;
    path: string;
}

export class AutoResponderEntryGlobFactory {
    private static identity = 0;

    static create(param: AutoResponderEntryGlobParam): AutoResponderEntryGlobEntity {
        return new AutoResponderEntryGlobEntity(
            new AutoResponderEntryGlobIdentity(param.id || ++this.identity),
            new AutoResponderEntryGlobPattern(param.pattern),
            new AutoResponderEntryBasePath(param.path),
            new AutoResponderEntryBaseType("Glob"),
        );
    }
}