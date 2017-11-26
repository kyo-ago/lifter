import { ClientRequestEntity } from "../../client-request/client-request-entity";
import { LocalFileResponderParam } from "../../local-file-responder/lifecycle/local-file-responder-factory";
import { AutoResponderEntryEntity } from "../auto-responder-entry-entity";
import { AutoResponderEntryDirectoryPath } from "./value-objects/auto-responder-entry-directory-path";
import { AutoResponderEntryDirectoryPattern } from "./value-objects/auto-responder-entry-directory-pattern";
export declare class AutoResponderEntryDirectoryEntity extends AutoResponderEntryEntity<
    AutoResponderEntryDirectoryPattern,
    AutoResponderEntryDirectoryPath
> {
    getMatchResponder(clientRequestEntity: ClientRequestEntity): Promise<LocalFileResponderParam | null>;
}
