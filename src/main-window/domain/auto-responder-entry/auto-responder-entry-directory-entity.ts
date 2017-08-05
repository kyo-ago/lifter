import * as fs from "fs";
import * as mime from "mime";
import {ClientRequestUrl} from "../client-request/value-objects/client-request-url";
import {LocalFileResponderParam} from "../local-file-responder/lifecycle/local-file-responder-factory";
import {AutoResponderEntryEntity} from "./auto-responder-entry-entity";

export class AutoResponderEntryDirectoryEntity extends AutoResponderEntryEntity {
    getMatchResponder(path: ClientRequestUrl): Promise<LocalFileResponderParam | null> {
        return this.getMatchStats(path).then((stats: fs.Stats | null) => {
            if (!stats) {
                return null;
            }
            return this.path.getMathFile(path).then((path) => {
                if (!path) {
                    return null;
                }
                return path.getState().then((stats: fs.Stats) => {
                    return {
                        path: path.value,
                        type: mime.lookup(path.value),
                        size: stats.size,
                    };
                });
            });
        });
    }
}
