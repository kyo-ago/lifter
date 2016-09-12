import * as React from "react";
import * as Rx from "@reactivex/rxjs/dist/cjs/Rx"

import {AutoResponderEntryRepository} from "../../domain/auto-responder-entry/auto-responder-entry-repository";
import {ClientRequestRepository} from "../../domain/client-request/client-request-repository";
import {ClientRequestEntity} from "../../domain/client-request/client-request-entity";
import {ProxyService} from "../../domain/proxy/proxy-service";

export class InitLoader extends React.Component<any, any> {
    static propTypes = {
        onLoad: React.PropTypes.func.isRequired
    };

    componentWillMount() {
        const { onLoad } = this.props;

        let autoResponderEntryRepository = new AutoResponderEntryRepository();
        let clientRequestRepository      = new ClientRequestRepository();
        let proxyService                 = new ProxyService(autoResponderEntryRepository, clientRequestRepository);

        window.addEventListener("dragover", (e) => e.preventDefault());
        window.addEventListener("dragleave", (e) => e.preventDefault());
        window.addEventListener("drop", (e) => e.preventDefault());
        document.body.addEventListener("dragend", (e) => e.preventDefault());

        let subject = new Rx.Subject<DragEvent>();
        window.addEventListener("drop", (e) => subject.next(e));
        subject.asObservable().subscribe((e) => {
            autoResponderEntryRepository.storeFilesList(Array.from(e.dataTransfer.files));
            autoResponderEntryRepository.getFilesList().then((files) => {
                // file list render
            });
        });
        clientRequestRepository.observer.subscribe((clientRequestEntity: ClientRequestEntity) => {
            // connection list render
        });

        proxyService.createServer();

        onLoad();
    }

    render() {
        return <span />;
    }
}