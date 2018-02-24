import { ClientRequestEntity } from "../../client-request/client-request-entity";
import { LocalFileResponderParam } from "../../local-file-responder/lifecycle/local-file-responder-factory";
import { AutoResponderEntity } from "../auto-responder-entity";
import { AutoResponderEntryAnyPath } from "./value-objects/auto-responder-entry-any-path";
import { AutoResponderEntryGlobPattern } from "./value-objects/auto-responder-entry-glob-pattern";

export class AutoResponderEntryGlobEntity extends AutoResponderEntity<
    AutoResponderEntryGlobPattern,
    AutoResponderEntryAnyPath
> {
    async getMatchResponder(clientRequestEntity: ClientRequestEntity): Promise<LocalFileResponderParam | null> {
        if (!this.pattern.isMatchPath(clientRequestEntity)) return null;

        let filePath = await this.path.getAutoResponderEntryFilePath(clientRequestEntity);

        return filePath ? this.filePathToLocalFileResponderParam(filePath) : null;
    }
}
