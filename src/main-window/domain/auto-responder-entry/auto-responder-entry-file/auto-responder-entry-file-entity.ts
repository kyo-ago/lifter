import * as mime from "mime";
import {ClientRequestUrl} from "../../client-request/value-objects/client-request-url";
import {LocalFileResponderParam} from "../../local-file-responder/lifecycle/local-file-responder-factory";
import {AutoResponderEntryEntity} from "../auto-responder-entry-entity";
import {AutoResponderEntryFilePath} from "./value-objects/auto-responder-entry-file-path";
import {AutoResponderEntryFilePattern} from "./value-objects/auto-responder-entry-file-pattern";

export class AutoResponderEntryFileEntity extends AutoResponderEntryEntity<AutoResponderEntryFilePattern, AutoResponderEntryFilePath> {
    getMatchResponder(clientRequestUrl: ClientRequestUrl): Promise<LocalFileResponderParam | null> {
        if (!this.pattern.isMatchPath(clientRequestUrl)) return;

        return this.filePathToLocalFileResponderParam(this.path);
    }
}
