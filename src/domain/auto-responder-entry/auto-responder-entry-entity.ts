import {Stats} from "fs";
import {Entity} from "typescript-dddbase";
import {AutoResponderEntryIdentity} from "./auto-responder-entry-identity";
import {AutoResponderEntryPattern} from "./auto-responder-entry-pattern";
import {AutoResponderEntryPath} from "./auto-responder-entry-path";
import {AutoResponderEntryType} from "./auto-responder-entry-type";
import {LocalFileResponderEntity} from "../local-file-responder/local-file-responder-entity";
import {LocalFileResponderFactory} from "../local-file-responder/local-file-responder-factory";
import {ClientRequestPathname} from "../client-request/client-request-pathname";
import {LocalFileResponderSize} from "../local-file-responder/local-file-responder-size";

export class AutoResponderEntryEntity extends Entity<AutoResponderEntryIdentity> {
    constructor(
        identity: AutoResponderEntryIdentity,
        private pattern: AutoResponderEntryPattern,
        private path: AutoResponderEntryPath,
        private type: AutoResponderEntryType,
    ) {
        super(identity);
    }

    get id() {
        return this.getIdentity().getValue();
    }

    get pattern() {
        return this.pattern.value;
    }

    get path() {
        return this.path.value;
    }

    get type() {
        return this.type.value;
    }

    getMatchResponder(path: ClientRequestPathname): Promise<LocalFileResponderEntity | null> {
        return this.getMatchStats(path).then((stats: Stats | null) => {
            if (!stats) {
                return null;
            }
            if (stats.isFile()) {
                return this.getFileResponder(stats);
            }
            if (stats.isDirectory()) {
                return this.getDirectoryResponder(path);
            }
            return Promise.reject(`Invalid type error`);
        });
    }

    private getMatchStats(path: ClientRequestPathname) {
        return new Promise((resolve) => {
            if (!this.pattern.isMatch(path)) {
                return resolve(null);
            }
            this.path.getState().then(resolve);
        });
    }

    private getFileResponder(stats: Stats) {
        return LocalFileResponderFactory.createResponder(
            this.path,
            this.type,
            new LocalFileResponderSize(stats.size),
        );
    }

    private getDirectoryResponder(path: ClientRequestPathname) {
        return this.path.getMathFile(path).then((path) => {
            if (!path) {
                return null;
            }
            return path.getState().then((stats: Stats) => {
                return LocalFileResponderFactory.createResponder(
                    path,
                    this.type,
                    new LocalFileResponderSize(stats.size),
                );
            });
        });
    }
}