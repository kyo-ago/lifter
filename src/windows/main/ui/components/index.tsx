import * as React from "react";
import {connect} from "react-redux";
import {ClientRequestEntity} from "../../../../contexts/proxy/client-request/client-request-entity";
import {ProjectFactory} from "../../../../contexts/proxy/project/lifecycle/project-factory";
import {Application} from "../../application/application";
import {LifecycleContextService} from "../../application/lifecycle-context/lifecycle-context-service";
import {ipcRendererHandler} from "../../libs/ipc-renderer-handler";
import {Actions} from "../action";
import {StateToProps} from "../reducer";
import {DragAndDropHandler} from "./null/drag-and-drop";
import {IpcHandler} from "./null/ipc-handler";
import {ToolbarHeader} from "./toolbar/toolbar-header";
import {WindowContent} from "./window/window-content";

class AppComponent extends React.Component<GlobalProps, any> {
    render() {
        return <div className="window">
            <ToolbarHeader {...this.props} />
            <WindowContent {...this.props} />
            <IpcHandler {...this.props} />
            <DragAndDropHandler {...this.props} />
        </div>;
    }
}

function mapStateToProps(state: StateToProps): StateToProps {
    return state;
}

let userDataPath = ipcRendererHandler.sendSync("getUserDataPath");
let projectFactory = new ProjectFactory();
let projectEntity = projectFactory.create();
let lifecycleContextService = new LifecycleContextService(projectEntity.id);
let application = new Application(
    userDataPath,
    lifecycleContextService,
);
export const App = application;
(window as any).application = application;

interface DispathProps {
    fileDrop: (files: File[]) => void;
    selectDialogEntry: (fileNames: string[]) => void;
    clickCertificateStatus: () => void;
    clickProxySettingStatus: () => void;
    contextmenuAutoResponderEntry: (id: number) => void;
    openRewriteRuleSettingWindow: () => void;
    openProxyBypassDomainSettingWindow: () => void;
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
        openProxyBypassDomainSettingWindow() {
            application.openProxyBypassDomainSettingWindow();
        },
    };
}

export const Index = connect(
    mapStateToProps,
    mapDispatchToProps,
)(AppComponent);
