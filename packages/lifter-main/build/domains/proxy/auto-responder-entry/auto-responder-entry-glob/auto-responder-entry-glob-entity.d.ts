import { ClientRequestEntity } from "../../client-request/client-request-entity";
import { LocalFileResponderParam } from "../../local-file-responder/lifecycle/local-file-responder-factory";
import { AutoResponderEntryEntity } from "../auto-responder-entry-entity";
import { AutoResponderEntryAnyPath } from "./value-objects/auto-responder-entry-any-path";
import { AutoResponderEntryGlobPattern } from "./value-objects/auto-responder-entry-glob-pattern";
export declare class AutoResponderEntryGlobEntity extends AutoResponderEntryEntity<
    AutoResponderEntryGlobPattern,
    AutoResponderEntryAnyPath
> {
    getMatchResponder(clientRequestEntity: ClientRequestEntity): Promise<LocalFileResponderParam | null>;
}
