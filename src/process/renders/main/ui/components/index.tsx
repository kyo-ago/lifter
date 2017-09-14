import * as React from 'react';
import {connect} from 'react-redux';
import {ClientRequestEntity} from '../../../../../domains/proxy/client-request/client-request-entity';
import {Application} from '../../application/application';
import {Actions} from '../action';
import {StateToProps} from '../reducer';
import {ApplicationMenu} from './null/application-menu';
import {DragAndDropHandler} from './null/drag-and-drop';
import {ToolbarHeader} from './toolbar/toolbar-header';
import {WindowContent} from './window/window-content';

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

    application.setOnUpdateClientRequestEntityEvent((clientRequestEntity: ClientRequestEntity) => {
        dispatch(Actions.clientProxyRequestEvent(clientRequestEntity));
    });

    return {
        async fileDrop(files: File[]) {
            let autoResponderEntries = await application.addDropFiles(files);
            dispatch(Actions.addAutoResponder(autoResponderEntries));
        },
        async selectDialogEntry(fileNames: string[]) {
            let autoResponderEntries = await application.selectDialogEntry(fileNames);
            dispatch(Actions.addAutoResponder(autoResponderEntries));
        },
        async clickCertificateStatus() {
            let certificateStatus = await application.clickCertificateStatus();
            dispatch(Actions.clickCertificateStatus(certificateStatus));
        },
        async clickProxySettingStatus() {
            let proxySettingStatus = await application.clickProxySettingStatus();
            dispatch(Actions.clickProxySettingStatus(proxySettingStatus));
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
