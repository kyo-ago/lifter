import * as mime from "mime";
import {Stats} from "fs";

import {AutoResponderEntryDirectoryIdentity} from "./auto-responder-entry-directory-identity";
import {AutoResponderEntryBaseEntity} from "../base/auto-responder-entry-base-entity";
import {LocalFileResponderEntity} from "../../../local-file-responder/local-file-responder-entity";
import {LocalFileResponderFactory} from "../../../local-file-responder/local-file-responder-factory";
import {LocalFileResponderSize} from "../../../local-file-responder/value-objects/local-file-responder-size";
import {LocalFileResponderPath} from "../../../local-file-responder/value-objects/local-file-responder-path";
import {LocalFileResponderType} from "../../../local-file-responder/value-objects/local-file-responder-type";
import {ClientRequestUrl} from "../../../client-request/value-objects/client-request-url";

export class AutoResponderEntryDirectoryEntity extends AutoResponderEntryBaseEntity<AutoResponderEntryDirectoryIdentity> {
    getMatchResponder(path: ClientRequestUrl): Promise<LocalFileResponderEntity | null> {
        return this.getMatchStats(path).then((stats: Stats | null) => {
            if (!stats) {
                return Promise.resolve(null);
            }
            return this._path.getMathFile(path).then((path) => {
                if (!path) {
                    return null;
                }
                return path.getState().then((stats: Stats) => {
                    return LocalFileResponderFactory.createResponder(
                        new LocalFileResponderPath(path.value),
                        new LocalFileResponderType(mime.lookup(path.value)),
                        new LocalFileResponderSize(stats.size),
                    );
                });
            });
        });
    }
}