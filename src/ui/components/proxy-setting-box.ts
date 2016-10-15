import * as React from "react";
import {ProxySettingService} from "../../domain/proxy-setting/proxy-setting-service";

export type ProxySettingBoxStatus = "On" | "Off";

export class ProxySettingBox extends React.Component<{
    status: ProxySettingBoxStatus;
    onChangeStatus: (newStatus: ProxySettingBoxStatus) => void;
}, {}> {
    private ProxySettingService = new ProxySettingService();

    componentWillMount() {
        this.ProxySettingService.hasProxySetting().then((result) => {
            this.props.onChangeStatus(result ? "installed" : "missing");
        });
    }

    onClick() {
        if (this.props.status === "missing") {
            this.ProxySettingService.installProxySetting().then(() => {
                this.props.onChangeStatus("installed");
            });
        } else {
            this.ProxySettingService.deleteProxySetting().then(() => {
                this.props.onChangeStatus("missing");
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