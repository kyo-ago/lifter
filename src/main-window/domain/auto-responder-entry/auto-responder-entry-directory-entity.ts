import * as fs from "fs";
import * as mime from "mime";
import {ClientRequestUrl} from "../client-request/value-objects/client-request-url";
import {LocalFileResponderParam} from "../local-file-responder/lifecycle/local-file-responder-factory";
import {AutoResponderEntryEntity} from "./auto-responder-entry-entity";

export class AutoResponderEntryDirectoryEntity extends AutoResponderEntryEntity {
    async getMatchResponder(clientRequestUrl: ClientRequestUrl): Promise<LocalFileResponderParam | null> {
        let directoryStats = await this.getMatchStats(clientRequestUrl);
        if (!directoryStats) {
            return null;
        }

        let filePath = await this.path.getMathFile(clientRequestUrl);
        if (!filePath) {
            return null;
        }

        let fileStats: fs.Stats = await filePath.getState();
        return {
            path: filePath.value,
            type: mime.lookup(filePath.value),
            size: fileStats.size,
        };
    }
}
