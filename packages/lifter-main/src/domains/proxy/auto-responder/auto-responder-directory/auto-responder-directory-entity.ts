import { ClientRequestEntity } from "../../client-request/client-request-entity";
import { LocalFileResponseParam } from "../../local-file-response/lifecycle/local-file-response-factory";
import { AutoResponderEntity } from "../auto-responder-entity";
import { AutoResponderDirectoryPath } from "./value-objects/auto-responder-directory-path";
import { AutoResponderDirectoryPattern } from "./value-objects/auto-responder-directory-pattern";

export class AutoResponderDirectoryEntity extends AutoResponderEntity<
    AutoResponderDirectoryPattern,
    AutoResponderDirectoryPath
> {
    getMatchResponder(clientRequestEntity: ClientRequestEntity): Promise<LocalFileResponseParam | null> {
        if (!this.pattern.isMatchPath(clientRequestEntity)) return null;

        let filePath = this.path.getAutoResponderFilePath(clientRequestEntity);
        return this.filePathToLocalFileResponseParam(filePath);
    }
}
