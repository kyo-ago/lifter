import * as React from "react";
import {connect} from "react-redux";
import {WindowContent} from "./window/window-content";
import {ToolbarHeader} from "./toolbar/toolbar-header";
import {Application} from "../../application/application";
import {Actions} from "../action";
import {IpcHandler} from "./null/ipc-handler";
import {ipcRendererHandler} from "../../libs/ipc-renderer-handler";
import {ProxySettingStatus} from "../../application/proxy-setting/proxy-setting-service";
import {CertificateStatus} from "../../application/certificate/certificate-service";
import {AutoResponderEntryEntity} from "../../domain/auto-responder-entry/auto-responder-entry-entity";
import {ClientRequestEntity} from "../../domain/client-request/client-request-entity";
import {DragAndDropHandler} from "./null/drag-and-drop";

class App extends React.Component<GlobalProps, any> {
    render() {
        return <div className="window">
            <ToolbarHeader {...this.props} />
            <WindowContent {...this.props} />
            <IpcHandler {...this.props} />
            <DragAndDropHandler {...this.props} />
        </div>;
    }
}

export interface StateToProps {
    autoResponderEntries: AutoResponderEntryEntity[],
    clientRequestEntries: ClientRequestEntity[],
    certificateState: CertificateStatus,
    proxySettingStatus: ProxySettingStatus,
}

function mapStateToProps(state: StateToProps): StateToProps {
    return state;
}

let userDataPath = ipcRendererHandler.sendSync("getUserDataPath");
let application = new Application(userDataPath);

interface Dispath {
    (action: {
        type: string;
    }): void;
}

interface DispathProps {
    fileDrop: (files: File[]) => void;
    selectDialogEntry: (fileNames: string[]) => void;
    clickCertificateStatus: () => void;
    clickProxySettingStatus: () => void;
    contextmenuAutoResponderEntry: (id: number) => void;
}

export interface GlobalProps extends DispathProps, StateToProps {}

function mapDispatchToProps(dispatch: Dispath): DispathProps {
    application.initialize(window);

    application.setOnProxyRequestEvent(() => {

    });
    return {
        fileDrop(files: File[]) {
            application.fileDrop(files).then(render);
        },
        selectDialogEntry(fileNames: string[]) {
            application.selectDialogEntry(fileNames).then(render);
        },
        clickCertificateStatus() {
            application.clickCertificateStatus().then(render);
        },
        clickProxySettingStatus() {
            application.clickProxySettingStatus().then(render);
        },
        contextmenuAutoResponderEntry(id: number) {
            application.contextmenuAutoResponderEntry(id);
        },
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(App);