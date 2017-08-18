import {BaseValueObject} from "../../../../share/domain/base/value-objects/base-value-object";
import {ClientRequestUrl} from "../../client-request/value-objects/client-request-url";

export abstract class AutoResponderEntryPattern extends BaseValueObject<string> {
    abstract isMatchPath(clientRequestUrl: ClientRequestUrl): boolean;
}
