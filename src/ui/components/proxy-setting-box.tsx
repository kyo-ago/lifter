import * as React from "react";
import {ProxySettingRepository} from "../../domain/proxy-setting/proxy-setting-repository";
import {ProxySettingEntity} from "../../domain/proxy-setting/proxy-setting-entity";
import {eventEmitter} from "../../libs/event-emitter";

export type ProxySettingBoxStatus = "NoPermission" | "On" | "Off";

export class ProxySettingBox extends React.Component<{
    status: ProxySettingBoxStatus;
}, {}> {
    private proxySettingRepository = new ProxySettingRepository();
    private proxySettingEntity: ProxySettingEntity;

    componentDidMount() {
        this.proxySettingRepository.getProxySetting().then((proxySettingEntity: ProxySettingEntity) => {
            this.proxySettingEntity = proxySettingEntity;
            if (!this.proxySettingEntity.isGranted) {
                return eventEmitter.emit("changeProxySettingStatus", "NoPermission");
            }
            this.proxySettingEntity.hasProxy().then((result: boolean) => {
                eventEmitter.emit("changeProxySettingStatus", result ? "On" : "Off");
            });
        });
    }

    onClick() {
        if (this.props.status === "Off") {
            this.proxySettingEntity.enableProxy().then(() => {
                eventEmitter.emit("changeProxySettingStatus", "On");
            });
        } else if (this.props.status === "NoPermission") {
            this.proxySettingEntity.grantProxy().then(() => {
                this.proxySettingEntity.hasProxy().then((result: boolean) => {
                    eventEmitter.emit("changeProxySettingStatus", result ? "On" : "Off");
                });
            });
        } else {
            this.proxySettingEntity.disableProxy().then(() => {
                eventEmitter.emit("changeProxySettingStatus", "Off");
            });
        }
    }

    render() {
        return (
            <button className="btn btn-default" onClick={this.onClick.bind(this)}>
                <span className="icon icon-folder"></span>
                {this.props.status}
            </button>
        );
    }
}