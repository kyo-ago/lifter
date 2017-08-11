import * as fs from "fs";
import {ClientRequestUrl} from "../../client-request/value-objects/client-request-url";
import {LocalFileResponderParam} from "../../local-file-responder/lifecycle/local-file-responder-factory";
import {AutoResponderEntryEntity} from "../auto-responder-entry-entity";
import {AutoResponderEntryAnyPath} from "./value-objects/auto-responder-entry-any-path";
import {AutoResponderEntryGlobPattern} from "./value-objects/auto-responder-entry-glob-pattern";
import {AutoResponderEntryFilePath} from "../auto-responder-entry-file/value-objects/auto-responder-entry-file-path";

export class AutoResponderEntryGlobEntity extends AutoResponderEntryEntity<AutoResponderEntryGlobPattern, AutoResponderEntryAnyPath> {
    async getMatchResponder(clientRequestUrl: ClientRequestUrl): Promise<LocalFileResponderParam | null> {
        if (!this.pattern.isMatchPath(clientRequestUrl)) return;

        let filePath = await this.path.getAutoResponderEntryFilePath(clientRequestUrl);
        return this.filePathToLocalFileResponderParam(filePath);
    }
}
