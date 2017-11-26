import { ClientRequestEntity } from "../../../client-request/client-request-entity";
import { AutoResponderEntryPattern } from "../../value-objects/auto-responder-entry-pattern";
export declare class AutoResponderEntryDirectoryPattern extends AutoResponderEntryPattern {
    static createSafeValue(pattern: string): AutoResponderEntryDirectoryPattern;
    getMatchCodeString(proxyConnect: string): string;
    isMatchPath(clientRequestEntity: ClientRequestEntity): boolean;
}
