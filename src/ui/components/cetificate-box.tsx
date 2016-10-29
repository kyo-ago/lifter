import * as React from "react";
import {CertificateService} from "../../domain/certificate/certificate-service";

export type CertificateBoxStatus = "missing" | "installed";

export class CertificateBox extends React.Component<{
    status: CertificateBoxStatus;
    onChangeStatus: (newStatus: CertificateBoxStatus) => void;
}, {}> {
    private certificateService = new CertificateService();

    componentWillMount() {
        this.certificateService.hasCertificate().then((result) => {
            this.props.onChangeStatus(result ? "installed" : "missing");
        });
    }

    onClick() {
        if (this.props.status === "missing") {
            this.certificateService.installCertificate().then(() => {
                this.props.onChangeStatus("installed");
            });
        } else {
            this.certificateService.deleteCertificate().then(() => {
                this.props.onChangeStatus("missing");
            });
        }
    }

    render() {
        return (
            <button className="btn btn-default" onClick={this.onClick.bind(this)}>
                <span className="icon icon-home"></span>
                {this.props.status}
            </button>
        );
    }
}