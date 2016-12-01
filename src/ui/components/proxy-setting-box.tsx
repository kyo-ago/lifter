import * as React from "react";
import {ProxySettingEntity} from "../../domain/proxy-setting/proxy-setting-entity";
import {eventEmitter} from "../../libs/event-emitter";

export type ProxySettingBoxStatus = "NoPermission" | "On" | "Off";

export class ProxySettingBox extends React.Component<{
    status: ProxySettingBoxStatus;
    proxySettingEntity: ProxySettingEntity;
}, {}> {
    componentDidMount() {
        if (!this.props.proxySettingEntity.isGranted) {
            return eventEmitter.emit("changeProxySettingStatus", "NoPermission");
        }
        this.props.proxySettingEntity.hasProxy().then((result: boolean) => {
            eventEmitter.emit("changeProxySettingStatus", result ? "On" : "Off");
        });
    }

    onClick() {
        if (this.props.status === "Off") {
            this.props.proxySettingEntity.enableProxy().then(() => {
                eventEmitter.emit("changeProxySettingStatus", "On");
            });
        } else if (this.props.status === "NoPermission") {
            this.props.proxySettingEntity.grantProxy().then(() => {
                this.props.proxySettingEntity.hasProxy().then((result: boolean) => {
                    eventEmitter.emit("changeProxySettingStatus", result ? "On" : "Off");
                });
            });
        } else {
            this.props.proxySettingEntity.disableProxy().then(() => {
                eventEmitter.emit("changeProxySettingStatus", "Off");
            });
        }
    }

    render() {
        let ui = ({
            'NoPermission' : {
                'className' : 'icon-cancel-circled',
                'title' : 'Require permission',
            },
            'On' : {
                'className' : 'icon-shuffle',
                'title' : 'Proxy off',
            },
            'Off' : {
                'className' : 'icon-switch',
                'title' : 'Proxy on',
            },
        } as any)[this.props.status];
        return (
            <button className="btn btn-default" title={ui.title} onClick={this.onClick.bind(this)}>
                <span className={`icon ${ui.className}`}></span>
            </button>
        );
    }
}