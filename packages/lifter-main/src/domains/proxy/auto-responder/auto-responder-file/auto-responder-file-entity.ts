import { ClientRequestEntity } from "../../client-request/client-request-entity";
import { LocalFileResponseParam } from "../../local-file-response/lifecycle/local-file-response-factory";
import { AutoResponderEntity } from "../auto-responder-entity";
import { AutoResponderFilePath } from "./value-objects/auto-responder-file-path";
import { AutoResponderFilePattern } from "./value-objects/auto-responder-file-pattern";

export class AutoResponderFileEntity extends AutoResponderEntity<
    AutoResponderFilePattern,
    AutoResponderFilePath
> {
    getMatchResponder(clientRequestEntity: ClientRequestEntity): Promise<LocalFileResponseParam | null> {
        if (!this.pattern.isMatchPath(clientRequestEntity)) return null;

        return this.filePathToLocalFileResponseParam(this.path);
    }
}
