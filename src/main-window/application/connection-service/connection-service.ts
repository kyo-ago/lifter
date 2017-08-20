import {AutoResponderEntryRepository} from "../../domain/auto-responder-entry/lifecycle/auto-responder-entry-repositoty";
import {ClientRequestEntity} from "../../domain/client-request/client-request-entity";
import {ClientRequestRepository} from "../../domain/client-request/lifecycle/client-request-repository";
import {LocalFileResponderEntity} from "../../domain/local-file-responder/local-file-responder-entity";

export class ConnectionService {
    constructor(
        private clientRequestRepository: ClientRequestRepository,
        private autoResponderEntryRepository: AutoResponderEntryRepository,
    ) { }

    async onRequest(
        clientRequestEntity: ClientRequestEntity,
        successCallback: (
            header: {[key: string]: string | number},
            body: Buffer | string,
        ) => void,
        errorCallback: (error: Error | undefined) => void,
    ) {
        this.clientRequestRepository.store(clientRequestEntity);

        let localFileResponderEntity: LocalFileResponderEntity | null = await this.autoResponderEntryRepository.findMatchEntry(clientRequestEntity);

        if (!localFileResponderEntity) {
            return errorCallback(undefined);
        }

        let body = await localFileResponderEntity.getBody();
        successCallback(localFileResponderEntity.getHeader(), body);
    }
}
