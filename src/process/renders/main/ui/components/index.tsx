import * as React from "react";
import {connect} from "react-redux";
import {ClientRequestEntity} from "../../../../../domains/proxy/client-request/client-request-entity";
import {ProjectFactory} from "../../../../../domains/proxy/project/lifecycle/project-factory";
import {Application} from "../../application/application";
import {LifecycleContextService} from "../../application/lifecycle-context/lifecycle-context-service";
import {Actions} from "../action";
import {StateToProps} from "../reducer";
import {ApplicationMenu} from "./null/application-menu";
import {DragAndDropHandler} from "./null/drag-and-drop";
import {ToolbarHeader} from "./toolbar/toolbar-header";
import {WindowContent} from "./window/window-content";

class AppComponent extends React.Component<GlobalProps, any> {
    render() {
        return <div className="window">
            <ToolbarHeader {...this.props} />
            <WindowContent {...this.props} />
            <ApplicationMenu {...this.props} />
            <DragAndDropHandler {...this.props} />
        </div>;
    }
}

function mapStateToProps(state: StateToProps): StateToProps {
    return state;
}

let projectFactory = new ProjectFactory();
let projectEntity = projectFactory.create();
let lifecycleContextService = new LifecycleContextService(projectEntity.id);
let application = new Application(
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
        async fileDrop(files: File[]) {
            let autoResponderEntryEntities = await application.fileDrop(files);
            dispatch(Actions.addAutoResponder(autoResponderEntryEntities));
        },
        async selectDialogEntry(fileNames: string[]) {
            let autoResponderEntryEntities = await application.selectDialogEntry(fileNames);
            dispatch(Actions.addAutoResponder(autoResponderEntryEntities));
        },
        async clickCertificateStatus() {
            let status = await application.clickCertificateStatus();
            dispatch(Actions.clickCertificateStatus(status));
        },
        async clickProxySettingStatus() {
            let status = await application.clickProxySettingStatus();
            dispatch(Actions.clickProxySettingStatus(status));
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
