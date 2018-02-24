import { ClientRequestEntity } from "../../client-request/client-request-entity";
import { LocalFileResponderParam } from "../../local-file-responder/lifecycle/local-file-responder-factory";
import { AutoResponderEntity } from "../auto-responder-entity";
import { AutoResponderEntryDirectoryPath } from "./value-objects/auto-responder-entry-directory-path";
import { AutoResponderEntryDirectoryPattern } from "./value-objects/auto-responder-entry-directory-pattern";

export class AutoResponderEntryDirectoryEntity extends AutoResponderEntity<
    AutoResponderEntryDirectoryPattern,
    AutoResponderEntryDirectoryPath
> {
    getMatchResponder(clientRequestEntity: ClientRequestEntity): Promise<LocalFileResponderParam | null> {
        if (!this.pattern.isMatchPath(clientRequestEntity)) return null;

        let filePath = this.path.getAutoResponderEntryFilePath(clientRequestEntity);
        return this.filePathToLocalFileResponderParam(filePath);
    }
}
