import * as URL from "url";
import { ClientRequestEntity } from "./client-request-entity";
import { ClientRequestFactory } from "./lifecycle/client-request-factory";
import { ClientRequestRepository } from "./lifecycle/client-request-repository";

export class ClientRequestService {
    constructor(
        private clientRequestFactory: ClientRequestFactory,
        private clientRequestRepository: ClientRequestRepository,
    ) {}
    private callbacks: ((clientRequestEntity: ClientRequestEntity) => void)[] = [];

    add(url: URL.Url): ClientRequestEntity {
        let clientRequestEntity = this.clientRequestFactory.create(url);
        this.clientRequestRepository.store(clientRequestEntity);
        this.fire(clientRequestEntity);
        return clientRequestEntity;
    }

    subscribe(callback: (clientRequestEntity: ClientRequestEntity) => void) {
        this.callbacks.push(callback);
    }

    private fire(clientRequestEntity: ClientRequestEntity) {
        this.callbacks.forEach((callback) => callback(clientRequestEntity));
    }
}
