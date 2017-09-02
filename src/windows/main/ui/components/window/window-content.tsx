import * as React from "react";
import {AutoResponderBox} from "./auto-responder-box";
import {ClientRequestBox} from "./client-request-box";
import {GlobalProps} from "../index";

export class WindowContent extends React.Component<GlobalProps, {}> {
    render() {
        return (
            <div className="window-content">
                <div className="pane-group">
                    <AutoResponderBox {...this.props} />
                    <ClientRequestBox {...this.props} />
                </div>
            </div>
        );
    }
}