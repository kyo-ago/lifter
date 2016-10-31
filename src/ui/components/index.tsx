import * as React from "react";
import {connect} from 'react-redux'
import {AutoResponderBoxEntry} from './auto-responder-box'
import {InitLoader} from './init-loader'
import AppActions from '../actions/index'
import {AppState} from "../reducers/index";
import {ClientRequestBoxEntry} from "./client-request-box";
import {CertificateBoxStatus} from "./cetificate-box";
import {ProxySettingBoxStatus} from "./proxy-setting-box";
import {WindowContent} from "./window-content";
import {ToolbarHeader} from "./toolbar-header";
import {eventEmitter} from "../../libs/eventEmitter";

class App extends React.Component<AppState, any> {
    render() {
        return <div className="window">
            <ToolbarHeader {...this.props} />
            <WindowContent {...this.props} />
        </div>;
        // return <div>
        //     <InitLoader
        //         onLoad={this.props.onLoad.bind(this)}
        //         onFileDrop={this.props.onFileDrop.bind(this)}
        //         onClientRequest={this.props.onClientRequest.bind(this)}
        //     />
        // </div>;
    }
}

function mapStateToProps(state: any) {
    return state;
}

function mapDispatchToProps(dispatch: any) {
    eventEmitter.addListener("load", () => {
        dispatch(AppActions.initLoad());
    });
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