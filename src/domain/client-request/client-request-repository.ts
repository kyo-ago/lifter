import * as Rx from "@reactivex/rxjs/dist/es6/Rx"
import {OnMemoryRepository} from "typescript-dddbase";
import {ClientRequestIdentity} from "./client-request-identity";
import {ClientRequestEntity} from "./client-request-entity";
import {ClientRequestUrl} from "./client-request-url";
import {ClientRequestFactory} from "./client-request-factory";

export class ClientRequestRepository extends OnMemoryRepository<ClientRequestIdentity, ClientRequestEntity> {
    public observer: Rx.Observable<ClientRequestEntity>;
    private subject: Rx.Subject<ClientRequestEntity>;

    constructor() {
        super();
        this.subject = new Rx.Subject();
        this.observer = this.subject.asObservable();
    }

    storeRequest(clientRequestUrl: ClientRequestUrl) {
        let clientRequestEntity = ClientRequestFactory.create(clientRequestUrl);
        this.store(clientRequestEntity);
        this.subject.next(clientRequestEntity);
    }
}
