import {Stats} from "Fs";
import {Entity} from "typescript-dddbase";
import {AutoResponderEntryIdentity} from "./auto-responder-entry-identity";
import {AutoResponderEntryPattern} from "./auto-responder-entry-pattern";
import {AutoResponderEntryPath} from "./auto-responder-entry-path";
import {AutoResponderEntryType} from "./auto-responder-entry-type";
import {LocalFileResponderEntity} from "../local-file-responder/local-file-responder-entity";
import {LocalFileResponderFactory} from "../local-file-responder/local-file-responder-factory";
import {ClientRequestPathname} from "../client-request/client-request-pathname";

export class AutoResponderEntryEntity extends Entity<AutoResponderEntryIdentity> {
    constructor(
        identity: AutoResponderEntryIdentity,
        private pattern: AutoResponderEntryPattern,
        private path: AutoResponderEntryPath,
        private type: AutoResponderEntryType,
    ) {
        super(identity);
    }

    getMatchResponder(path: ClientRequestPathname): Promise<LocalFileResponderEntity | null> {
        return new Promise((resolve) => {
            if (!this.pattern.isMatch(path)) {
                return resolve(null);
            }
            return this.path.getState();
        }).then((stats: Stats) => {
            if (stats.isFile()) {
                return LocalFileResponderFactory.createResponder(this.path, this.type);
            }
            if (stats.isDirectory()) {
                return this.path.getMathFile(path).then(() => {
                    return LocalFileResponderFactory.createResponder(this.path, this.type);
                });
            }
            return Promise.reject(`Invalid type error`);
        });
    }
}