import * as Path from "path";
import { ClientRequestEntity } from "../../../client-request/client-request-entity";
import { AutoResponderEntryFilePath } from "../../auto-responder-entry-file/value-objects/auto-responder-entry-file-path";
import { AutoResponderEntryPath } from "../../value-objects/auto-responder-entry-path";

export class AutoResponderEntryAnyPath extends AutoResponderEntryPath {
    async getAutoResponderEntryFilePath(
        clientRequestEntity: ClientRequestEntity
    ): Promise<AutoResponderEntryFilePath | null> {
        let stat = await this.getState();
        if (stat.isFile()) {
            return new AutoResponderEntryFilePath(this.value);
        }

        if (!stat.isDirectory()) {
            return null;
        }

        let pathname = clientRequestEntity.pathname;

        // /
        if (pathname === "/") {
            return null;
        }

        // /hoge
        if (pathname.match(/^\/[^\/]+$/)) {
            return new AutoResponderEntryFilePath(Path.join(this.value, pathname));
        }

        let splited = pathname.split(`/${Path.basename(this.value)}/`);

        // unmatch
        if (splited.length === 1) return null;

        let lastPath = splited.pop();

        // directory match
        if (!lastPath) return null;

        return new AutoResponderEntryFilePath(Path.join(this.value, lastPath));
    }
}
