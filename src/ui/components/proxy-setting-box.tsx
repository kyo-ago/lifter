import * as React from "react";
import {eventEmitter} from "../../libs/event-emitter";
import {ProxySettingStatus} from "../../application/proxy-setting/proxy-setting-service";

export class ProxySettingBox extends React.Component<{
    status: ProxySettingStatus;
}, {}> {
    onClick() {
        eventEmitter.emit("clickProxySettingStatus");
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
        } as any)[this.props.status];
        return (
            <button className="btn btn-default" title={ui.title} onClick={this.onClick.bind(this)}>
                <span className={`icon ${ui.className}`}></span>
            </button>
        );
    }
}