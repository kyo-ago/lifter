import { ClientRequestEntity } from "../../client-request/client-request-entity";
import { LocalFileResponderParam } from "../../local-file-responder/lifecycle/local-file-responder-factory";
import { AutoResponderEntity } from "../auto-responder-entity";
import { AutoResponderFilePath } from "./value-objects/auto-responder-file-path";
import { AutoResponderFilePattern } from "./value-objects/auto-responder-file-pattern";

export class AutoResponderFileEntity extends AutoResponderEntity<
    AutoResponderFilePattern,
    AutoResponderFilePath
> {
    getMatchResponder(clientRequestEntity: ClientRequestEntity): Promise<LocalFileResponderParam | null> {
        if (!this.pattern.isMatchPath(clientRequestEntity)) return null;

        return this.filePathToLocalFileResponderParam(this.path);
    }
}
