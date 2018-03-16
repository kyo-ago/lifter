import * as Rx from "rxjs/Rx";
import * as URL from "url";
import { ClientRequestEntityJSON } from "@lifter/lifter-common";
import { ClientRequestEntity } from "./client-request-entity";
import { ClientRequestFactory } from "./lifecycle/client-request-factory";
import { ClientRequestRepository } from "./lifecycle/client-request-repository";

export interface getClientRequestService {
    subscribe: (callback: (clientRequestEntity: ClientRequestEntity) => void) => void;
    fetchAll: () => Promise<ClientRequestEntityJSON[]>;
}

export class ClientRequestService {
    constructor(
        private clientRequestFactory: ClientRequestFactory,
        private clientRequestRepository: ClientRequestRepository,
    ) {}

    private observable: Rx.Subject<ClientRequestEntity> = new Rx.Subject();

    store(url: URL.Url): ClientRequestEntity {
        let clientRequestEntity = this.clientRequestFactory.create(url);
        this.clientRequestRepository.store(clientRequestEntity);
        this.observable.next(clientRequestEntity);
        return clientRequestEntity;
    }

    getClientRequestService(): getClientRequestService {
        return {
            subscribe: (callback: (clientRequestEntity: ClientRequestEntity) => void): void => {
                this.observable.subscribe(callback);
            },
            fetchAll: (): Promise<ClientRequestEntityJSON[]> => {
                return this.resolveAll();
            },
        };
    }

    private async resolveAll(): Promise<ClientRequestEntityJSON[]> {
        let clientRequestEntries = await this.clientRequestRepository.resolveAll();
        return clientRequestEntries.map((entity): ClientRequestEntityJSON => entity.json);
    }
}
