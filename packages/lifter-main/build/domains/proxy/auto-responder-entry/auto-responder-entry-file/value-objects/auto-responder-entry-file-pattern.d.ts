import { ClientRequestEntity } from "../../../client-request/client-request-entity";
import { AutoResponderEntryPattern } from "../../value-objects/auto-responder-entry-pattern";
export declare class AutoResponderEntryFilePattern extends AutoResponderEntryPattern {
    getMatchCodeString(proxyConnect: string): string;
    isMatchPath(clientRequestEntity: ClientRequestEntity): boolean;
}
