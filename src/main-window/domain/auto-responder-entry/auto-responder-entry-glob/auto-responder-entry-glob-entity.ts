import {ClientRequestUrl} from "../../client-request/value-objects/client-request-url";
import {LocalFileResponderParam} from "../../local-file-responder/lifecycle/local-file-responder-factory";
import {AutoResponderEntryEntity} from "../auto-responder-entry-entity";
import {AutoResponderEntryAnyPath} from "./value-objects/auto-responder-entry-any-path";
import {AutoResponderEntryGlobPattern} from "./value-objects/auto-responder-entry-glob-pattern";
import {ClientRequestEntity} from "../../client-request/client-request-entity";

export class AutoResponderEntryGlobEntity extends AutoResponderEntryEntity<AutoResponderEntryGlobPattern, AutoResponderEntryAnyPath> {
    async getMatchResponder(clientRequestEntity: ClientRequestEntity): Promise<LocalFileResponderParam | null> {
        if (!this.pattern.isMatchPath(clientRequestEntity)) return null;

        let filePath = await this.path.getAutoResponderEntryFilePath(clientRequestEntity);

        return filePath
            ? this.filePathToLocalFileResponderParam(filePath)
            : null
        ;
    }
}
