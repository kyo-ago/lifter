import * as React from "react";
import {CertificateService} from "../../domain/certificate/certificate-service";
import {eventEmitter} from "../../libs/event-emitter";

export type CertificateBoxStatus = "missing" | "installed";

export class CertificateBox extends React.Component<{
    status: CertificateBoxStatus;
}, {}> {
    private certificateService = new CertificateService();

    componentDidMount() {
        this.certificateService.hasCertificate().then((result) => {
            eventEmitter.emit("changeCertificateStatus", result ? "installed" : "missing");
        });
    }

    onClick() {
        if (this.props.status === "missing") {
            this.certificateService.installCertificate().then(() => {
                eventEmitter.emit("changeCertificateStatus", "installed");
            });
        } else {
            this.certificateService.deleteCertificate().then(() => {
                eventEmitter.emit("changeCertificateStatus", "missing");
            });
        }
    }

    render() {
        let ui = ({
            'missing' : {
                'className' : 'icon-install',
                'title' : 'Install SSL/TLS certification',
            },
            'installed' : {
                'className' : 'icon-key',
                'title' : 'Delete SSL/TLS certification',
            },
        } as any)[this.props.status];

        return (
            <button className="btn btn-default" title={ui.title} onClick={this.onClick.bind(this)}>
                <span className={`icon ${ui.className}`}></span>
            </button>
        );
    }
}