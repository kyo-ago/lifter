import * as React from "react";
import {ProxySettingRepository} from "../../domain/proxy-setting/proxy-setting-repository";
import {ProxySettingEntity} from "../../domain/proxy-setting/proxy-setting-entity";

export type ProxySettingBoxStatus = "NoPermission" | "On" | "Off";

export class ProxySettingBox extends React.Component<{
    status: ProxySettingBoxStatus;
    onChangeStatus: (newStatus: ProxySettingBoxStatus) => void;
}, {}> {
    private proxySettingRepository = new ProxySettingRepository();
    private proxySettingEntity: ProxySettingEntity;

    componentWillMount() {
        debugger;
        this.proxySettingRepository.getProxySetting().then((proxySettingEntity: ProxySettingEntity) => {
            this.proxySettingEntity = proxySettingEntity;
            if (!this.proxySettingEntity.isGranted) {
                return this.props.onChangeStatus("NoPermission");
            }
            this.proxySettingEntity.hasProxy().then((result: boolean) => {
                this.props.onChangeStatus(result ? "On" : "Off");
            });
        });
    }

    onClick() {
        if (this.props.status === "Off") {
            this.proxySettingEntity.enableProxy().then(() => {
                this.props.onChangeStatus("On");
            });
        } else if (this.props.status === "NoPermission") {
            this.proxySettingEntity.grantProxy().then(() => {
                this.proxySettingEntity.hasProxy().then((result: boolean) => {
                    this.props.onChangeStatus(result ? "On" : "Off");
                });
            });
        } else {
            this.proxySettingEntity.disableProxy().then(() => {
                this.props.onChangeStatus("Off");
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