import * as Path from "path";
import { ClientRequestEntity } from "../../../client-request/client-request-entity";
import { AutoResponderFilePath } from "../../auto-responder-file/value-objects/auto-responder-file-path";
import { AutoResponderPath } from "../../value-objects/auto-responder-path";

export class AutoResponderDirectoryPath extends AutoResponderPath {
    getAutoResponderFilePath(clientRequestEntity: ClientRequestEntity): AutoResponderFilePath {
        let lastPath = clientRequestEntity.pathname.split(`/${Path.basename(this.value)}/`).pop();
        return new AutoResponderFilePath(Path.join(this.value, lastPath));
    }
}
