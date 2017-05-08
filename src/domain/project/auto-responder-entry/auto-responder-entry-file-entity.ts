import * as fs from "fs";
import * as mime from "mime";
import {AutoResponderEntryInterface} from "./auto-responder-entry-interface";
import {AutoResponderEntryBaseEntity} from "./auto-responder-entry-base-entity";
import {LocalFileResponderSize} from "../../local-file-responder/value-objects/local-file-responder-size";
import {LocalFileResponderType} from "../../local-file-responder/value-objects/local-file-responder-type";
import {LocalFileResponderPath} from "../../local-file-responder/value-objects/local-file-responder-path";
import {LocalFileResponderEntity} from "../../local-file-responder/local-file-responder-entity";
import {ClientRequestUrl} from "../../client-request/value-objects/client-request-url";
import {LocalFileResponderFactory} from "../../local-file-responder/local-file-responder-factory";

export class AutoResponderEntryFileEntity extends AutoResponderEntryBaseEntity implements AutoResponderEntryInterface {
    type: "File";

    getMatchResponder(path: ClientRequestUrl): Promise<LocalFileResponderEntity | null> {
        return this.getMatchStats(path).then((stats: fs.Stats | null) => {
            if (!stats) {
                return Promise.resolve(null);
            }
            return LocalFileResponderFactory.create(
                new LocalFileResponderPath(this.path.value),
                new LocalFileResponderType(mime.lookup(this.path.value)),
                new LocalFileResponderSize(stats.size),
            );
        });
    }
}
