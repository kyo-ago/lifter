import {Entity} from "typescript-dddbase";
import {AutoResponderEntryIdentity} from "./auto-responder-entry-identity";
import {AutoResponderEntryPattern} from "./auto-responder-entry-pattern";
import {AutoResponderEntryPath} from "./auto-responder-entry-path";

export class AutoResponderEntryEntity extends Entity<AutoResponderEntryIdentity> {
    constructor(
        identity: AutoResponderEntryIdentity,
        pattern: AutoResponderEntryPattern,
        path: AutoResponderEntryPath,
    ) {
        super(identity);
    }
}