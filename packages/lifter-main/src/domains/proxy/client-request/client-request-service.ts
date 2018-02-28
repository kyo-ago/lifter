import * as Rx from "rxjs/Rx";
import * as URL from "url";
import { ClientRequestEntity } from "./client-request-entity";
import { ClientRequestFactory } from "./lifecycle/client-request-factory";
import { ClientRequestRepository } from "./lifecycle/client-request-repository";

export class ClientRequestService {
    constructor(
        private clientRequestFactory: ClientRequestFactory,
        private clientRequestRepository: ClientRequestRepository,
    ) {}
    public observable: Rx.Subject<ClientRequestEntity> = new Rx.Subject();

    store(url: URL.Url): ClientRequestEntity {
        let clientRequestEntity = this.clientRequestFactory.create(url);
        this.clientRequestRepository.store(clientRequestEntity);
        this.observable.next(clientRequestEntity);
        return clientRequestEntity;
    }
}
