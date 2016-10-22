import {Stats} from "fs";
import {Entity} from "typescript-dddbase";
import {AutoResponderEntryIdentity} from "./auto-responder-entry-identity";
import {AutoResponderEntryPattern} from "./auto-responder-entry-pattern";
import {AutoResponderEntryPath} from "./auto-responder-entry-path";
import {AutoResponderEntryType} from "./auto-responder-entry-type";
import {LocalFileResponderEntity} from "../local-file-responder/local-file-responder-entity";
import {LocalFileResponderFactory} from "../local-file-responder/local-file-responder-factory";
import {ClientRequestUrl} from "../client-request/client-request-url";
import {LocalFileResponderSize} from "../local-file-responder/local-file-responder-size";

export class AutoResponderEntryEntity extends Entity<AutoResponderEntryIdentity> {
    constructor(
        identity: AutoResponderEntryIdentity,
        private _pattern: AutoResponderEntryPattern,
        private _path: AutoResponderEntryPath,
        private _type: AutoResponderEntryType,
    ) {
        super(identity);
    }

    get id() {
        return this.getIdentity().getValue();
    }

    get pattern() {
        return this._pattern.value;
    }

    get path() {
        return this._path.value;
    }

    get type() {
        return this._type.value;
    }

    getMatchResponder(path: ClientRequestUrl): Promise<LocalFileResponderEntity | null> {
        return this.getMatchStats(path).then((stats: Stats | null) => {
            if (!stats) {
                return Promise.resolve(null);
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

    private getMatchStats(path: ClientRequestUrl) {
        return new Promise((resolve) => {
            if (!this._pattern.isMatch(path)) {
                return resolve(null);
            }
            return this._path.getState();
        });
    }

    private getFileResponder(stats: Stats) {
        return LocalFileResponderFactory.createResponder(
            this._path,
            this._type,
            new LocalFileResponderSize(stats.size),
        );
    }

    private getDirectoryResponder(path: ClientRequestUrl) {
        return this._path.getMathFile(path).then((path) => {
            if (!path) {
                return null;
            }
            return path.getState().then((stats: Stats) => {
                return LocalFileResponderFactory.createResponder(
                    path,
                    this._type,
                    new LocalFileResponderSize(stats.size),
                );
            });
        });
    }
}