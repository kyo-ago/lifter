import * as React from "react";
import {eventEmitter} from "../../libs/event-emitter";
import {CertificateStatus} from "../../application/certificate/certificate-service";

export class CertificateBox extends React.Component<{
    status: CertificateStatus;
}, {}> {
    onClick() {
        eventEmitter.emit("clickCertificateStatus");
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