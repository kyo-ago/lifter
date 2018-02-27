import { ClientRequestEntity } from "../../client-request/client-request-entity";
import { LocalFileResponderFactory } from "../../local-file-responder/lifecycle/local-file-responder-factory";
import { LocalFileResponderEntity } from "../../local-file-responder/local-file-responder-entity";
import { AbstractAutoResponderEntity } from "../auto-responder-entity";

export class FindMatchEntry {
    constructor(
        private localFileResponderFactory: LocalFileResponderFactory,
    ) {}

    async getLocalFileResponder(
        promise: Promise<LocalFileResponderEntity | null>,
        clientRequestEntity: ClientRequestEntity,
        autoResponderEntity: AbstractAutoResponderEntity,
    ): Promise<LocalFileResponderEntity | null> {
        let result = await promise;
        if (result) return result;

        let localFileResponderParam = await autoResponderEntity.getMatchResponder(clientRequestEntity);
        if (!localFileResponderParam) {
            return null;
        }

        return this.localFileResponderFactory.create(localFileResponderParam);
    }
}
