import * as Path from "path";
import {ClientRequestUrl} from "../../../client-request/value-objects/client-request-url";
import {AutoResponderEntryFilePath} from "../../auto-responder-entry-file/value-objects/auto-responder-entry-file-path";
import {AutoResponderEntryPath} from "../../value-objects/auto-responder-entry-path";

export class AutoResponderEntryDirectoryPath extends AutoResponderEntryPath {
    getAutoResponderEntryFilePath(clientRequestUrl: ClientRequestUrl): AutoResponderEntryFilePath {
        let lastPath = clientRequestUrl.getPathname().split(`/${Path.basename(this.value)}/`).pop();
        return new AutoResponderEntryFilePath(Path.join(this.value, lastPath));
    }
}
