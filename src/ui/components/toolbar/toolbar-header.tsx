import * as React from "react";
import {CertificateBox} from "./cetificate-box";
import {ProxySettingBox} from "./proxy-setting-box";
import {GlobalProps} from "../index";
import {OpenRewriteRuleSettingWindowBox} from "./open-rewrite-rule-setting-window-box";

export class ToolbarHeader extends React.Component<GlobalProps, {}> {
    render() {
        return (
            <header className="toolbar toolbar-header">
                <div className="toolbar-actions">
                    <div className="btn-group">
                        <CertificateBox {...this.props} />
                        <ProxySettingBox {...this.props} />
                        <OpenRewriteRuleSettingWindowBox {...this.props} />
                    </div>
                </div>
            </header>
        );
    }
}