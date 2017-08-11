import * as Path from "path";
import {ClientRequestUrl} from "../../../client-request/value-objects/client-request-url";
import {AutoResponderEntryFilePath} from "../../auto-responder-entry-file/value-objects/auto-responder-entry-file-path";
import {AutoResponderEntryPath} from "../../value-objects/auto-responder-entry-path";

export class AutoResponderEntryAnyPath extends AutoResponderEntryPath {
    async getAutoResponderEntryFilePath(clientRequestUrl: ClientRequestUrl): Promise<AutoResponderEntryFilePath> {
        let stat = await this.getState();
        if (stat.isFile()) {
            return new AutoResponderEntryFilePath(this.value);
        }

        let lastPath = clientRequestUrl.getPathname().split(`/${Path.basename(this.value)}/`).pop();
        return new AutoResponderEntryFilePath(Path.join(this.value, lastPath));
    }
}
