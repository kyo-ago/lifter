import { ClientRequestEntity } from "../../../client-request/client-request-entity";
import { AutoResponderEntryFilePath } from "../../auto-responder-entry-file/value-objects/auto-responder-entry-file-path";
import { AutoResponderEntryPath } from "../../value-objects/auto-responder-entry-path";
export declare class AutoResponderEntryAnyPath extends AutoResponderEntryPath {
    getAutoResponderEntryFilePath(clientRequestEntity: ClientRequestEntity): Promise<AutoResponderEntryFilePath | null>;
}
