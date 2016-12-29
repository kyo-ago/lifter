import * as mime from "mime";
import {Stats} from "fs";

import {AutoResponderEntryFileIdentity} from "./auto-responder-entry-file-identity";
import {AutoResponderEntryBaseEntity} from "../base/auto-responder-entry-base-entity";
import {LocalFileResponderEntity} from "../../../local-file-responder/local-file-responder-entity";
import {LocalFileResponderFactory} from "../../../local-file-responder/local-file-responder-factory";
import {LocalFileResponderSize} from "../../../local-file-responder/value-objects/local-file-responder-size";
import {LocalFileResponderPath} from "../../../local-file-responder/value-objects/local-file-responder-path";
import {LocalFileResponderType} from "../../../local-file-responder/value-objects/local-file-responder-type";
import {ClientRequestUrl} from "../../../client-request/value-objects/client-request-url";

export class AutoResponderEntryFileEntity extends AutoResponderEntryBaseEntity<AutoResponderEntryFileIdentity> {
    getMatchResponder(path: ClientRequestUrl): Promise<LocalFileResponderEntity | null> {
        return this.getMatchStats(path).then((stats: Stats | null) => {
            if (!stats) {
                return Promise.resolve(null);
            }
            return LocalFileResponderFactory.createResponder(
                new LocalFileResponderPath(this._path.value),
                new LocalFileResponderType(mime.lookup(this._path.value)),
                new LocalFileResponderSize(stats.size),
            );
        });
    }
}