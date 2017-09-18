import * as React from 'react';
import {GlobalProps} from '../index';

export class CertificateBox extends React.Component<GlobalProps, {}> {
    onClick() {
        this.props.clickCertificateStatus();
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
        } as any)[this.props.certificateState];

        return (
            <button className="btn btn-default" title={ui.title} onClick={this.onClick.bind(this)}>
                <span className={`icon ${ui.className}`}></span>
            </button>
        );
    }
}