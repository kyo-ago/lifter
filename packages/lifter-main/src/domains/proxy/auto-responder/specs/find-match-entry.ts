import { injectable } from "inversify";
import { ClientRequestEntity } from "../../client-request/client-request-entity";
import { LocalFileResponseFactory } from "../../local-file-response/lifecycle/local-file-response-factory";
import { LocalFileResponseEntity } from "../../local-file-response/local-file-response-entity";
import { AbstractAutoResponderEntity } from "../auto-responder-entity";

@injectable()
export class FindMatchEntry {
    constructor(private localFileResponseFactory: LocalFileResponseFactory) {}

    async getLocalFileResponse(
        promise: Promise<LocalFileResponseEntity | null>,
        clientRequestEntity: ClientRequestEntity,
        autoResponderEntity: AbstractAutoResponderEntity,
    ): Promise<LocalFileResponseEntity | null> {
        let result = await promise;
        if (result) return result;

        let localFileResponseParam = await autoResponderEntity.getMatchResponder(clientRequestEntity);
        if (!localFileResponseParam) {
            return null;
        }

        return this.localFileResponseFactory.create(localFileResponseParam);
    }
}
