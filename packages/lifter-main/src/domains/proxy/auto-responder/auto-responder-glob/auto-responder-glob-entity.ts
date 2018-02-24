import { ClientRequestEntity } from "../../client-request/client-request-entity";
import { LocalFileResponderParam } from "../../local-file-responder/lifecycle/local-file-responder-factory";
import { AutoResponderEntity } from "../auto-responder-entity";
import { AutoResponderAnyPath } from "./value-objects/auto-responder-any-path";
import { AutoResponderGlobPattern } from "./value-objects/auto-responder-glob-pattern";

export class AutoResponderGlobEntity extends AutoResponderEntity<
    AutoResponderGlobPattern,
    AutoResponderAnyPath
> {
    async getMatchResponder(clientRequestEntity: ClientRequestEntity): Promise<LocalFileResponderParam | null> {
        if (!this.pattern.isMatchPath(clientRequestEntity)) return null;

        let filePath = await this.path.getAutoResponderFilePath(clientRequestEntity);

        return filePath ? this.filePathToLocalFileResponderParam(filePath) : null;
    }
}
