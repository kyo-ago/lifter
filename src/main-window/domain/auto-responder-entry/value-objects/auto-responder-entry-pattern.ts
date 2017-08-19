import {BaseValueObject} from "../../../../share/domain/base/value-objects/base-value-object";
import {ClientRequestEntity} from "../../client-request/client-request-entity";

export abstract class AutoResponderEntryPattern extends BaseValueObject<string> {
    abstract isMatchPath(clientRequestEntity: ClientRequestEntity): boolean;
}
