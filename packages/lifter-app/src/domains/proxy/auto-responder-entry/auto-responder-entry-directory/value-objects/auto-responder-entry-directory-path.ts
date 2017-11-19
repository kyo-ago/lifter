import * as Path from "path";
import { ClientRequestEntity } from "../../../client-request/client-request-entity";
import { AutoResponderEntryFilePath } from "../../auto-responder-entry-file/value-objects/auto-responder-entry-file-path";
import { AutoResponderEntryPath } from "../../value-objects/auto-responder-entry-path";

export class AutoResponderEntryDirectoryPath extends AutoResponderEntryPath {
    getAutoResponderEntryFilePath(clientRequestEntity: ClientRequestEntity): AutoResponderEntryFilePath {
        let lastPath = clientRequestEntity.pathname.split(`/${Path.basename(this.value)}/`).pop();
        return new AutoResponderEntryFilePath(Path.join(this.value, lastPath));
    }
}
