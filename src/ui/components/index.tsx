import * as React from "react";
import {connect} from 'react-redux'
import {AutoResponderBoxEntry} from './auto-responder-box'
import AppActions from '../actions/index'
import {AppState} from "../reducers/index";
import {ClientRequestBoxEntry} from "./client-request-box";
import {CertificateBoxStatus} from "./cetificate-box";
import {ProxySettingBoxStatus} from "./proxy-setting-box";
import {WindowContent} from "./window-content";
import {ToolbarHeader} from "./toolbar-header";
import {eventEmitter} from "../../libs/event-emitter";
import {InitializeService} from "../../domain/initialize/initialize-service";

class App extends React.Component<any, any> {
    componentDidMount() {
        let initializeService = new InitializeService();
        initializeService.init(window);
    }
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
    eventEmitter.addListener("fileDrop", (autoResponderBoxEntry: AutoResponderBoxEntry) => {
        dispatch(AppActions.fileDrop(autoResponderBoxEntry));
    });
    eventEmitter.addListener("clientRequest", (clientRequestEntity: ClientRequestBoxEntry) => {
        dispatch(AppActions.clientRequest(clientRequestEntity));
    });
    eventEmitter.addListener("changeCertificateStatus", (certificateBoxStatus: CertificateBoxStatus) => {
        dispatch(AppActions.changeCirtificateStatus(certificateBoxStatus));
    });
    eventEmitter.addListener("changeProxySettingStatus", (proxySettingBoxStatus: ProxySettingBoxStatus) => {
        dispatch(AppActions.changeProxySettingStatus(proxySettingBoxStatus));
    });
    return {};
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(App);