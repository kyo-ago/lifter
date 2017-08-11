import {ClientRequestUrl} from "../../client-request/value-objects/client-request-url";
import {LocalFileResponderParam} from "../../local-file-responder/lifecycle/local-file-responder-factory";
import {AutoResponderEntryEntity} from "../auto-responder-entry-entity";
import {AutoResponderEntryDirectoryPath} from "./value-objects/auto-responder-entry-directory-path";
import {AutoResponderEntryFilePath} from "../auto-responder-entry-file/value-objects/auto-responder-entry-file-path";
import {AutoResponderEntryDirectoryPattern} from "./value-objects/auto-responder-entry-directory-pattern";

export class AutoResponderEntryDirectoryEntity extends AutoResponderEntryEntity<AutoResponderEntryDirectoryPattern, AutoResponderEntryDirectoryPath> {
    getMatchResponder(clientRequestUrl: ClientRequestUrl): Promise<LocalFileResponderParam | null> {
        if (!this.pattern.isMatchPath(clientRequestUrl)) return;

        let filePath = this.path.getAutoResponderEntryFilePath(clientRequestUrl);
        return this.filePathToLocalFileResponderParam(filePath);
    }
}
