import * as React from "react";
import {remote} from "electron";
import {ipcRendererHandler} from "../../../../libs/ipc-renderer-handler";
import {GlobalProps} from "../index";

export class IpcHandler extends React.Component<GlobalProps, {}> {
    componentDidMount() {
        ipcRendererHandler.on("addAutoResponderEntry", () => {
            remote.dialog.showOpenDialog(null, {
                properties: ['openDirectory', 'openFile', 'createDirectory'],
            }, (filePaths) => {
                this.props.selectDialogEntry(filePaths);
            });
        });
        ipcRendererHandler.on("clickCertificateStatus", () => {
            this.props.clickCertificateStatus();
        });
        ipcRendererHandler.on("clickProxySettingStatus", () => {
            this.props.clickProxySettingStatus();
        });
    }
    render(): any {
        return null;
    }
}
