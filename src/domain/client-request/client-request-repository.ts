import * as Rx from "@reactivex/rxjs/dist/cjs/Rx"
import {OnMemoryRepository} from "typescript-dddbase";
import {ClientRequestIdentity} from "./client-request-identity";
import {ClientRequestEntity} from "./client-request-entity";
import {ClientRequestUrl} from "./value-objects/client-request-url";
import {ClientRequestFactory} from "./client-request-factory";
import {ClientRequestBoxEntry} from "../../ui/components/client-request-box";

export class ClientRequestRepository extends OnMemoryRepository<ClientRequestIdentity, ClientRequestEntity> {
    public observer: Rx.Observable<ClientRequestBoxEntry>;
    private subject: Rx.Subject<ClientRequestBoxEntry>;

    constructor() {
        super();
        this.subject = new Rx.Subject<ClientRequestBoxEntry>();
        this.observer = this.subject.asObservable();
    }

    storeRequest(clientRequestUrl: ClientRequestUrl) {
        let entity = ClientRequestFactory.create(clientRequestUrl);
        this.store(entity);
        this.subject.next({
            id: entity.id,
            url: entity.url
        });
    }
}
