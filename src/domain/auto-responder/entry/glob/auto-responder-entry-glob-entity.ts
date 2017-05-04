import * as mime from "mime";
import {Stats} from "fs";

import {AutoResponderEntryGlobIdentity} from "./auto-responder-entry-glob-identity";
import {AutoResponderEntryBaseEntity} from "../base/auto-responder-entry-base-entity";
import {LocalFileResponderEntity} from "../../../local-file-responder/local-file-responder-entity";
import {LocalFileResponderFactory} from "../../../local-file-responder/local-file-responder-factory";
import {LocalFileResponderSize} from "../../../local-file-responder/value-objects/local-file-responder-size";
import {LocalFileResponderPath} from "../../../local-file-responder/value-objects/local-file-responder-path";
import {LocalFileResponderType} from "../../../local-file-responder/value-objects/local-file-responder-type";
import {ClientRequestUrl} from "../../../client-request/value-objects/client-request-url";

export class AutoResponderEntryGlobEntity extends AutoResponderEntryBaseEntity<AutoResponderEntryGlobIdentity> {
    getMatchResponder(path: ClientRequestUrl): Promise<LocalFileResponderEntity | null> {
        return this.getMatchStats(path).then((stats: Stats | null) => {
            if (!stats) {
                return Promise.resolve(null);
            }
            return LocalFileResponderFactory.create(
                new LocalFileResponderPath(this._path.value),
                new LocalFileResponderType(mime.lookup(this._path.value)),
                new LocalFileResponderSize(stats.size),
            );
        });
    }
}