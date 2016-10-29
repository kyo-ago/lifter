import * as React from "react";
import {CertificateBox} from "./cetificate-box";
import {ProxySettingBox} from "./proxy-setting-box";

export class ToolbarHeader extends React.Component<{}, {}> {
    render() {
        return (
            <header className="toolbar toolbar-header">
                <div className="toolbar-actions">
                    <div className="btn-group">
                        <CertificateBox
                            status={"missing"}
                            onChangeStatus={() => {}}
                        />
                        <ProxySettingBox
                            status={"NoPermission"}
                            onChangeStatus={() => {}}
                        />
                    </div>
                </div>
            </header>
        );
    }
}