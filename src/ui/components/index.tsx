import * as React from "react";
import {connect} from 'react-redux'
import {AutoResponderBoxEntry} from './auto-responder-box'
import AppActions from '../actions/index'
import {ClientRequestBoxEntry} from "./client-request-box";
import {WindowContent} from "./window-content";
import {ToolbarHeader} from "./toolbar-header";
import {eventEmitter} from "../../libs/event-emitter";
import {CertificateService, CertificateStatus} from "../../domain/certificate/certificate-service";
import {ProxySettingService, ProxySettingStatus} from "../../domain/proxy-setting/proxy-setting-service";
import {AutoResponderService} from "../../domain/auto-responder/auto-responder-service";
import {ClientRequestRepository} from "../../domain/client-request/client-request-repository";
import {ProxyService} from "../../domain/proxy/proxy-service";

class App extends React.Component<any, any> {
    render() {
        return <div className="window">
            <ToolbarHeader {...this.props} />
            <WindowContent {...this.props} />
        </div>;
    }
}

function mapStateToProps(state: any) {
    return state;
}

function mapDispatchToProps(dispatch: any) {
    window.addEventListener("dragover", (e) => e.preventDefault());
    window.addEventListener("dragleave", (e) => e.preventDefault());
    window.addEventListener("drop", (e) => e.preventDefault());
    window.document.body.addEventListener("dragend", (e) => e.preventDefault());

    /**
     * AutoResponderService
     */
    let autoResponderService = new AutoResponderService();
    autoResponderService.bind(window).subscribe((autoResponderBoxEntry: AutoResponderBoxEntry) => {
        dispatch(AppActions.fileDrop(autoResponderBoxEntry));
    });

    /**
     * ClientRequestRepository
     */
    let clientRequestRepository = new ClientRequestRepository();
    clientRequestRepository.observer.subscribe((clientRequestEntity: ClientRequestBoxEntry) => {
        dispatch(AppActions.clientRequest(clientRequestEntity));
    });

    /**
     * ProxyService
     */
    let proxyService = new ProxyService(autoResponderService, clientRequestRepository);
    proxyService.createServer();

    /**
     * CertificateService
     */
    let certificateService = new CertificateService();
    certificateService.getCurrentStatus().then((certificateBoxStatus: CertificateStatus) => {
        dispatch(AppActions.changeCirtificateStatus(certificateBoxStatus));
    });
    eventEmitter.addListener("clickCertificateStatus", () => {
        certificateService.getNewStatus().then((certificateBoxStatus: CertificateStatus) => {
            dispatch(AppActions.changeCirtificateStatus(certificateBoxStatus));
        });
    });

    /**
     * ProxySettingService
     */
    let proxySettingService = new ProxySettingService();
    proxySettingService.initialize().then((proxySettingStatus: ProxySettingStatus) => {
        dispatch(AppActions.changeProxySettingStatus(proxySettingStatus));
    });
    eventEmitter.addListener("clickProxySettingStatus", () => {
        proxySettingService.click().then((proxySettingStatus: ProxySettingStatus) => {
            dispatch(AppActions.changeProxySettingStatus(proxySettingStatus));
        });
    });
    return {};
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(App);