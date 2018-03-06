import { ClientRequestEntity } from "../../client-request/client-request-entity";
import { LocalFileResponseParam } from "../../local-file-response/lifecycle/local-file-response-factory";
import { AutoResponderEntity } from "../auto-responder-entity";
import { AutoResponderAnyPath } from "./value-objects/auto-responder-any-path";
import { AutoResponderGlobPattern } from "./value-objects/auto-responder-glob-pattern";

export class AutoResponderGlobEntity extends AutoResponderEntity<AutoResponderGlobPattern, AutoResponderAnyPath> {
    async getMatchResponder(clientRequestEntity: ClientRequestEntity): Promise<LocalFileResponseParam | null> {
        if (!this.pattern.isMatchPath(clientRequestEntity)) return null;

        let filePath = await this.path.getAutoResponderFilePath(clientRequestEntity);

        return filePath ? this.filePathToLocalFileResponseParam(filePath) : null;
    }
}
