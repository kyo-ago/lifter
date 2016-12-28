import * as mime from "mime";
import {Stats} from "fs";
import {Entity} from "typescript-dddbase";

import {AutoResponderEntryBaseIdentity} from "./auto-responder-entry-base-identity";
import {AutoResponderEntryBasePattern} from "./value-objects/auto-responder-entry-base-pattern";
import {AutoResponderEntryBasePath} from "./value-objects/auto-responder-entry-base-path";
import {AutoResponderEntryBaseType} from "./value-objects/auto-responder-entry-base-type";
import {LocalFileResponderEntity} from "../../../local-file-responder/local-file-responder-entity";
import {LocalFileResponderFactory} from "../../../local-file-responder/local-file-responder-factory";
import {ClientRequestUrl} from "../../../client-request/value-objects/client-request-url";
import {LocalFileResponderSize} from "../../../local-file-responder/value-objects/local-file-responder-size";
import {LocalFileResponderPath} from "../../../local-file-responder/value-objects/local-file-responder-path";
import {LocalFileResponderType} from "../../../local-file-responder/value-objects/local-file-responder-type";

export class AutoResponderEntryBaseEntity extends Entity<AutoResponderEntryBaseIdentity> {
    constructor(
        identity: AutoResponderEntryBaseIdentity,
        private _pattern: AutoResponderEntryBasePattern,
        private _path: AutoResponderEntryBasePath,
        private _type: AutoResponderEntryBaseType,
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
        return new Promise((resolve, reject) => {
            if (!this._pattern.isMatch(path)) {
                return resolve(null);
            }
            this._path.getState().then(resolve, reject);
        });
    }

    private getFileResponder(stats: Stats) {
        return LocalFileResponderFactory.createResponder(
            new LocalFileResponderPath(this._path.value),
            new LocalFileResponderType(mime.lookup(this._path.value)),
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
                    new LocalFileResponderType(mime.lookup(path.value)),
                    new LocalFileResponderSize(stats.size),
                );
            });
        });
    }
}