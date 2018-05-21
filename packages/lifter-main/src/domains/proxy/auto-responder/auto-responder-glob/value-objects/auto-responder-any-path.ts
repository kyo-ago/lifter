import * as Path from "path";
import { ClientRequestEntity } from "../../../client-request/client-request-entity";
import { AutoResponderFilePath } from "../../value-objects/auto-responder-file-path";
import { AutoResponderPath } from "../../value-objects/auto-responder-path";

export class AutoResponderAnyPath extends AutoResponderPath {
    async getAutoResponderFilePath(
        clientRequestEntity: ClientRequestEntity,
    ): Promise<AutoResponderFilePath | null> {
        let stat = await this.getState();
        if (stat.isFile()) {
            return new AutoResponderFilePath(this.value);
        }

        if (!stat.isDirectory()) {
            return null;
        }

        let pathSearch = clientRequestEntity.pathSearch;

        // /
        if (pathSearch === "/") {
            return null;
        }

        // /hoge
        if (pathSearch.match(/^\/[^\/]+$/)) {
            return new AutoResponderFilePath(Path.join(this.value, pathSearch));
        }

        let splited = pathSearch.split(`/${Path.basename(this.value)}/`);

        // unmatch
        if (splited.length === 1) return null;

        let lastPath = splited.pop();

        // directory match
        if (!lastPath) return null;

        return new AutoResponderFilePath(Path.join(this.value, lastPath));
    }
}
