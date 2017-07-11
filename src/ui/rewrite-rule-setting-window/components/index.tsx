import * as React from "react";
import {connect} from "react-redux";
import {WindowContent} from "./window/window-content";
import {ToolbarHeader} from "./toolbar/toolbar-header";
import {Application} from "../../../application/application";
import {Actions} from "../action";
import {IpcHandler} from "./null/ipc-handler";
import {ipcRendererHandler} from "../../../libs/ipc-renderer-handler";
import {ProxySettingStatus} from "../../../application/proxy-setting/proxy-setting-service";
import {CertificateStatus} from "../../../application/certificate/certificate-service";
import {AutoResponderEntryEntity} from "../../../domain/auto-responder-entry/auto-responder-entry-entity";
import {ClientRequestEntity} from "../../../domain/client-request/client-request-entity";
import {DragAndDropHandler} from "./null/drag-and-drop";

class App extends React.Component<GlobalProps, any> {
    render() {
        return <div className="window">
            <div className="window-content">
                <div className="pane-group">
                    <div className="pane pane-sm sidebar">
                        <table className="table-striped">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Kind</th>
                                    <th>Date Modified</th>
                                    <th>Author</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>variables.scss</td>
                                    <td>Document</td>
                                    <td>Oct 13, 2015</td>
                                    <td>connors</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="pane">
                        <form>
                            <select className="form-control">
                                <option>Modify</option>
                                <option>Add</option>
                                <option>Delete</option>
                            </select>
                            <div className="form-group">
                                <label>header</label>
                                <input type="text" className="form-control" placeholder="user agent" />
                            </div>
                            <div className="form-group">
                                <label>value</label>
                                <input type="text" className="form-control" placeholder="user agent" />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
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
    openRewriteRuleSettingWindow: () => void;
}

export interface GlobalProps extends DispathProps, StateToProps {}

function mapDispatchToProps(dispatch: Dispath): DispathProps {
    application.initialize(window);

    application.setOnProxyRequestEvent((clientRequestEntity: ClientRequestEntity) => {
        dispatch(Actions.clientProxyRequestEvent(clientRequestEntity));
    });
    return {
        fileDrop(files: File[]) {
            application.fileDrop(files).then((autoResponderEntryEntities) => {
                dispatch(Actions.addAutoResponder(autoResponderEntryEntities));
            });
        },
        selectDialogEntry(fileNames: string[]) {
            application.selectDialogEntry(fileNames).then((autoResponderEntryEntities) => {
                dispatch(Actions.addAutoResponder(autoResponderEntryEntities));
            });
        },
        clickCertificateStatus() {
            application.clickCertificateStatus().then((status) => {
                dispatch(Actions.clickCertificateStatus(status));
            });
        },
        clickProxySettingStatus() {
            application.clickProxySettingStatus().then((status) => {
                dispatch(Actions.clickProxySettingStatus(status));
            });
        },
        contextmenuAutoResponderEntry(id: number) {
            application.contextmenuAutoResponderEntry(id);
        },
        openRewriteRuleSettingWindow() {
            application.openRewriteRuleSettingWindow();
        },
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(App);