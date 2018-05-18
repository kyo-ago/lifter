import { ClientRequestEntityJSON } from "@lifter/lifter-common";
import { injectable } from "inversify";
import * as Rx from "rxjs/Rx";
import * as URL from "url";
import { LOCAL_PAC_FILE_URL } from "../../../settings";
import { PacFileService } from "../../settings/pac-file/pac-file-service";
import { AutoResponderService } from "../auto-responder/auto-responder-service";
import { ClientRequestEntity } from "./client-request-entity";
import { ClientResponderContext } from "./lib/client-responder-context";
import { ClientRequestFactory } from "./lifecycle/client-request-factory";
import { ClientRequestRepository } from "./lifecycle/client-request-repository";

export interface getClientRequestService {
    subscribe: (
        callback: (clientRequestEntity: ClientRequestEntityJSON) => void,
    ) => void;
    fetchAll: () => Promise<ClientRequestEntityJSON[]>;
}

@injectable()
export class ClientRequestService {
    private observable: Rx.Subject<ClientRequestEntityJSON> = new Rx.Subject();

    constructor(
        private autoResponderService: AutoResponderService,
        private pacFileService: PacFileService,
        private clientRequestFactory: ClientRequestFactory,
        private clientRequestRepository: ClientRequestRepository,
    ) {}

    store(url: URL.Url): ClientRequestEntity {
        let clientRequestEntity = this.clientRequestFactory.create(url);
        this.clientRequestRepository.store(clientRequestEntity);
        this.observable.next(clientRequestEntity.json);
        return clientRequestEntity;
    }

    getClientRequestService(): getClientRequestService {
        return {
            subscribe: (
                callback: (
                    clientRequestEntity: ClientRequestEntityJSON,
                ) => void,
            ): void => {
                this.observable.subscribe(callback);
            },
            fetchAll: (): Promise<ClientRequestEntityJSON[]> => {
                return this.resolveAll();
            },
        };
    }

    async onRequest(
        clientResponderContext: ClientResponderContext,
    ): Promise<void> {
        let url = clientResponderContext.getUrl();

        if (LOCAL_PAC_FILE_URL.test(url.href)) {
            return await this.pacFileService.response(clientResponderContext);
        }

        let clientRequestEntity = this.store(url);

        return await this.autoResponderService.response(
            clientResponderContext,
            clientRequestEntity,
        );
    }

    private async resolveAll(): Promise<ClientRequestEntityJSON[]> {
        let clientRequestEntries = await this.clientRequestRepository.resolveAll();
        return clientRequestEntries.map(
            (entity): ClientRequestEntityJSON => entity.json,
        );
    }
}
