import * as React from "react";
import * as Rx from "@reactivex/rxjs/dist/cjs/Rx"

import {AutoResponderEntryRepository} from "../../domain/auto-responder-entry/auto-responder-entry-repository";
import {ClientRequestRepository} from "../../domain/client-request/client-request-repository";
import {ProxyService} from "../../domain/proxy/proxy-service";
import {AutoResponderBoxEntry} from "./auto-responder-box";
import {ClientRequestBoxEntry} from "./client-request-box";

export class InitLoader extends React.Component<{
    onLoad: () => void;
    onFileDrop: (autoResponderBoxEntry: AutoResponderBoxEntry) => void;
    onClientRequest: (clientRequestEntity: ClientRequestBoxEntry) => void;
}, any> {
    static propTypes = {
        onLoad: React.PropTypes.func.isRequired,
        onFileDrop: React.PropTypes.func.isRequired,
        onClientRequest: React.PropTypes.func.isRequired
    };

    componentWillMount() {
        const { onLoad, onFileDrop, onClientRequest } = this.props;

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
        });
        autoResponderEntryRepository.observer.subscribe((autoResponderBoxEntry: AutoResponderBoxEntry) => {
            onFileDrop(autoResponderBoxEntry);
        });
        clientRequestRepository.observer.subscribe((clientRequestEntity: ClientRequestBoxEntry) => {
            onClientRequest(clientRequestEntity);
        });

        proxyService.createServer();

        onLoad();
    }

    render() {
        return <span />;
    }
}