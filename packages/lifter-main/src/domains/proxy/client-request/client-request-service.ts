import { ClientRequestEntityJSON } from "@lifter/lifter-common";
import * as Rx from "rxjs/Rx";
import * as URL from "url";
import { ClientRequestEntity } from "./client-request-entity";
import { ClientRequestFactory } from "./lifecycle/client-request-factory";
import { ClientRequestRepository } from "./lifecycle/client-request-repository";

export interface getClientRequestService {
    subscribe: (callback: (clientRequestEntity: ClientRequestEntityJSON) => void) => void;
    fetchAll: () => Promise<ClientRequestEntityJSON[]>;
}

export class ClientRequestService {
    constructor(
        private clientRequestFactory: ClientRequestFactory,
        private clientRequestRepository: ClientRequestRepository,
    ) {}

    private observable: Rx.Subject<ClientRequestEntityJSON> = new Rx.Subject();

    store(url: URL.Url): ClientRequestEntity {
        let clientRequestEntity = this.clientRequestFactory.create(url);
        this.clientRequestRepository.store(clientRequestEntity);
        this.observable.next(clientRequestEntity.json);
        return clientRequestEntity;
    }

    getClientRequestService(): getClientRequestService {
        return {
            subscribe: (callback: (clientRequestEntity: ClientRequestEntityJSON) => void): void => {
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
