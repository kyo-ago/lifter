import * as React from "react";
import {CertificateBox} from "./cetificate-box";
import {ProxySettingBox} from "./proxy-setting-box";
import {AppState} from "../reducers/index";

export class ToolbarHeader extends React.Component<AppState, {}> {
    render() {
        return (
            <header className="toolbar toolbar-header">
                <div className="toolbar-actions">
                    <div className="btn-group">
                        <CertificateBox
                            status={this.props.certificateBoxStatus}
                        />
                        <ProxySettingBox
                            status={this.props.proxySettingBoxStatus}
                            proxySettingEntity={this.props.proxySettingEntity}
                        />
                    </div>
                </div>
            </header>
        );
    }
}