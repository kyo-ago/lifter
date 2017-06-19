import * as React from "react";
import {GlobalProps} from "../index";

export class ProxySettingBox extends React.Component<GlobalProps, {}> {
    onClick() {
        this.props.clickProxySettingStatus();
    }

    render() {
        let ui = ({
            'NoPermission' : {
                'className' : 'icon-cancel-circled',
                'title' : 'Require permission',
            },
            'On' : {
                'className' : 'icon-shuffle',
                'title' : 'ProxyService off',
            },
            'Off' : {
                'className' : 'icon-switch',
                'title' : 'ProxyService on',
            },
        } as any)[this.props.proxySettingStatus];
        return (
            <button className="btn btn-default" title={ui.title} onClick={this.onClick.bind(this)}>
                <span className={`icon ${ui.className}`}></span>
            </button>
        );
    }
}