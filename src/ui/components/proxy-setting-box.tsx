import * as React from "react";
import {ProxySettingService} from "../../domain/proxy-setting/proxy-setting-service";
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
        this.proxySettingRepository.getProxySetting().then((proxySettingEntity: ProxySettingEntity) => {
            this.proxySettingEntity = proxySettingEntity;
            this.props.onChangeStatus(this.proxySettingEntity.isGranted ? "Off" : "NoPermission");
        });
    }

    onClick() {
        if (this.props.status === "Off") {
            this.proxySettingEntity.enableProxy().then(() => {
                this.props.onChangeStatus("On");
            });
        } else if (this.props.status === "NoPermission") {
            this.proxySettingEntity.grantProxy().then(() => {
                this.props.onChangeStatus("Off");
            });
        } else {
            this.proxySettingEntity.disableProxy().then(() => {
                this.props.onChangeStatus("Off");
            });
        }
    }

    render() {
        return (
            <div className="status" onClick={this.onClick.bind(this)}>
                {this.props.status}
            </div>
        );
    }
}