import {Stats} from "fs";
import {Entity} from "typescript-dddbase";
import {AutoResponderEntryIdentity} from "./auto-responder-entry-identity";
import {AutoResponderEntryPattern} from "./auto-responder-entry-pattern";
import {AutoResponderEntryPath} from "./auto-responder-entry-path";
import {AutoResponderEntryType} from "./auto-responder-entry-type";
import {LocalFileResponderEntity} from "../local-file-responder/local-file-responder-entity";

export class AutoResponderEntryEntity extends Entity<AutoResponderEntryIdentity> {
    constructor(
        identity: AutoResponderEntryIdentity,
        private pattern: AutoResponderEntryPattern,
        private path: AutoResponderEntryPath,
        private path: AutoResponderEntryType,
    ) {
        super(identity);
    }

    matchPathname(path: string): Promise<LocalFileResponderEntity | null> {
        return new Promise((resolve, reject) => {
            if (!this.pattern.isMatch(path)) {
                return resolve(null);
            }
            return this.path.getState();
        }).then((stats: Stats) => {
            stats.isFile()
        });
    }
}