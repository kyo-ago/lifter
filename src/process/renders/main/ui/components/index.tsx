import * as React from "react";
import {connect} from "react-redux";
import {AbstractAutoResponderEntryEntity} from "../../../../../domains/proxy/auto-responder-entry/auto-responder-entry-entity";
import {ClientRequestEntity} from "../../../../../domains/proxy/client-request/client-request-entity";
import {ProxySettingStatus} from "../../../../../domains/settings/proxy-setting/proxy-setting-entity";
import {CertificateStatus} from "../../../../main/certificate/certificate-service";
import {Application} from "../../application/application";
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

interface DispathProps {
    fileDrop: (files: File[]) => void;
    selectDialogEntry: (fileNames: string[]) => void;
    clickCertificateStatus: () => void;
    clickProxySettingStatus: () => void;
    contextmenuAutoResponderEntry: (id: number) => void;
    openRewriteRuleSettingWindow: () => void;
    openProxyBypassDomainSettingWindow: () => void;
}

export type GlobalProps = DispathProps & StateToProps;

let application = new Application();

function mapDispatchToProps(dispatch: Dispath): DispathProps {
    application.initialize(window);

    application.setOnUpdateAutoResponderEntryEvent((autoResponderEntry: AbstractAutoResponderEntryEntity) => {
        dispatch(Actions.addAutoResponder([autoResponderEntry]));
    });

    application.setOnUpdateClientRequestEntityEvent((clientRequestEntity: ClientRequestEntity) => {
        dispatch(Actions.clientProxyRequestEvent(clientRequestEntity));
    });

    application.setOnUpdateCertificateStatusEvent((certificateStatus: CertificateStatus) => {
        dispatch(Actions.clickCertificateStatus(certificateStatus));
    });

    application.setOnUpdateProxySettingStatusEvent((proxySettingStatus: ProxySettingStatus) => {
        dispatch(Actions.clickProxySettingStatus(proxySettingStatus));
    });

    return {
        fileDrop(files: File[]) {
            application.addDropFiles(files);
        },
        selectDialogEntry(fileNames: string[]) {
            application.selectDialogEntry(fileNames);
        },
        clickCertificateStatus() {
            application.clickCertificateStatus();
        },
        clickProxySettingStatus() {
            application.clickProxySettingStatus();
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
    (state: StateToProps) => state,
    mapDispatchToProps,
)(AppComponent);
