import * as React from "react";
import {ProxySettingService} from "../../domain/proxy-setting/proxy-setting-service";

export type ProxySettingBoxStatus = "On" | "Off";

export class ProxySettingBox extends React.Component<{
    status: ProxySettingBoxStatus;
    onChangeStatus: (newStatus: ProxySettingBoxStatus) => void;
}, {}> {
    private ProxySettingService = new ProxySettingService();

    componentWillMount() {
        this.ProxySettingService.hasProxy().then((result) => {
            this.props.onChangeStatus(result ? "On" : "Off");
        });
    }

    onClick() {
        if (this.props.status === "Off") {
            this.ProxySettingService.enableProxy().then(() => {
                this.props.onChangeStatus("On");
            });
        } else {
            this.ProxySettingService.disableProxy().then(() => {
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